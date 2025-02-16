interface ActivePeriod {
  start?: number;
  end?: number;
}

interface Translation {
  text: string;
  language: string;
}

interface InformedEntity {
  route_id?: string;
  stop_id?: string;
  'transit_realtime.mercury_entity_selector'?: {
    sort_order?: string;
  };
}

interface MercuryAlert {
  created_at?: number;
  updated_at?: number;
  alert_type?: string;
  service_plan_number?: string[];
  display_before_active?: number;
  human_readable_active_period?: {
    translation?: Translation[];
  };
  station_alternative?: {
    affected_entity?: {
      stop_id?: string;
    };
    notes?: {
      translation?: Translation[];
    };
  }[];
}

interface AlertEntity {
  id: string;
  alert: {
    active_period?: ActivePeriod[];
    informed_entity?: InformedEntity[];
    header_text?: {
      translation?: Translation[];
    };
    description_text?: {
      translation?: Translation[];
    };
    'transit_realtime.mercury_alert': MercuryAlert;
  };
}

function getTranslation(
  translations?: Translation[],
  lang: string = 'en'
): string | null {
  return translations?.find((t) => t.language === lang)?.text || null;
}

function getActivePeriods(activePeriods?: ActivePeriod[]) {
  return (
    activePeriods?.map((period) => ({
      start: period.start ? new Date(period.start * 1000).toISOString() : null,
      end: period.end ? new Date(period.end * 1000).toISOString() : null,
    })) || []
  );
}

function getInformedEntities(entities?: InformedEntity[]) {
  const informedRoutes: any = [];
  const informedStops: any = [];

  entities?.forEach((entity) => {
    const routeId = entity.route_id || null;
    const stopId = entity.stop_id || null;

    // Extract sort order level (everything after the last colon)
    const fullSortOrder =
      entity?.['transit_realtime.mercury_entity_selector']?.sort_order || null;
    const sortOrder = fullSortOrder ? fullSortOrder.split(':').pop() : null;

    if (routeId) {
      informedRoutes.push({
        routeId,
        sortOrder,
      });
    }

    if (stopId) {
      informedStops.push({
        stopId,
      });
    }
  });

  return { routes: informedRoutes, stops: informedStops };
}

function getMercuryAlert(mercury?: MercuryAlert) {
  if (!mercury) return null;

  return {
    createdAt: mercury.created_at
      ? new Date(mercury.created_at * 1000).toISOString()
      : null,
    updatedAt: mercury.updated_at
      ? new Date(mercury.updated_at * 1000).toISOString()
      : null,
    alertType: mercury.alert_type || null,
    servicePlanNumber: mercury.service_plan_number || [],
    displayBeforeActive: mercury.display_before_active || 0,
    humanReadableActivePeriod: getTranslation(
      mercury.human_readable_active_period?.translation
    ),
    stationAlternatives:
      mercury.station_alternative?.map((alt) => ({
        stopId: alt.affected_entity?.stop_id || null,
        notes: getTranslation(alt.notes?.translation),
      })) || [],
  };
}

function isAlertActive(
  activePeriods: { start: string | null; end: string | null }[],
  displayBeforeActive: number
) {
  const now = Date.now();
  const activePeriod = activePeriods.find((period) => {
    if (!period.end) return true; // Active indefinitely
    if (!period.start) return false; // Shouldn't happen

    const start = new Date(period.start).getTime();
    const end = new Date(period.end).getTime();

    return start - displayBeforeActive < now && end > now;
  });

  return activePeriod || null;
}

export function cleanAlertEntities(entities: AlertEntity[], header: any) {
  const lastFetched = new Date().toISOString();

  const lastUpdated = new Date(header.timestamp * 1000).toISOString();

  const alerts = [];

  for (const entity of entities) {
    const alert = entity.alert;
    const mercury = alert?.['transit_realtime.mercury_alert'];
    const active_periods = getActivePeriods(alert?.active_period);

    if (!isAlertActive(active_periods, mercury?.display_before_active || 0)) {
      continue; // Skip inactive alerts
    }

    alerts.push({
      id: entity.id,
      informedEntities: getInformedEntities(alert?.informed_entity),
      headerText: getTranslation(alert?.header_text?.translation),
      descriptionText: getTranslation(alert?.description_text?.translation),
      mercuryAlert: getMercuryAlert(mercury),
    });
  }

  // Return flat object with keys
  return {
    lastFetched,
    lastUpdated,
    alerts,
  };
}

export function organizeAlertsByRoute(cleanedAlerts: any) {
  const alertsByRoute: Record<string, any[]> = {};

  cleanedAlerts.alerts.forEach((alert: any) => {
    alert.informedEntities.routes.forEach((route: any) => {
      const routeId = route.routeId;
      if (!alertsByRoute[routeId]) {
        alertsByRoute[routeId] = [];
      }
      alertsByRoute[routeId].push(alert);
    });
  });

  return {
    lastFetched: cleanedAlerts.lastFetched,
    lastUpdated: cleanedAlerts.lastUpdated,
    alerts: alertsByRoute,
  };
}
