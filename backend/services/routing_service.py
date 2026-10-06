import math
import json

def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Calculates distance between two geographical points in kilometers.
    """
    R = 6371.0 # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2) + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * (math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

def evaluate_partner_routing(partner, scheme_id, user_lat=26.85, user_lon=80.94):
    """
    Evaluates partner eligibility based on scheme support, fund utilization, NPA status, and distance.
    """
    supported_schemes = partner['supported_schemes']
    if isinstance(supported_schemes, str):
        supported_schemes = json.loads(supported_schemes)

    # 1. Distance Calculation
    lat = float(partner['latitude'])
    lon = float(partner['longitude'])
    distance_km = haversine_distance(user_lat, user_lon, lat, lon)

    # 2. Scheme Compatibility Check
    supports_scheme = scheme_id in supported_schemes if scheme_id else True

    # 3. Operational & Financial Health Criteria
    fund_utilization = float(partner['fund_utilization_percentage'])
    npa_status = partner['npa_status']
    overdue_percentage = float(partner['overdue_percentage'])

    reasons = []
    is_eligible = True

    if not supports_scheme:
        is_eligible = False
        reasons.append(f"Partner does not support selected scheme ({scheme_id}).")

    if fund_utilization > 92.0:
        is_eligible = False
        reasons.append(f"Fund utilization limit ({fund_utilization}%) exhausted.")

    if npa_status == "Above Threshold" or overdue_percentage > 10.0:
        is_eligible = False
        reasons.append(f"NPA/Overdue ratio ({overdue_percentage}%) exceeds maximum nodal threshold (10.0%).")

    routing_status = "Eligible" if is_eligible else "Restricted"
    restriction_reason = " | ".join(reasons) if not is_eligible else ""

    return {
        "partner_id": partner['id'],
        "name": partner['name'],
        "type": partner['type'],
        "address": partner['address'],
        "city": partner['city'],
        "state": partner['state'],
        "latitude": lat,
        "longitude": lon,
        "distance_km": distance_km,
        "supports_scheme": supports_scheme,
        "fund_utilization_percentage": fund_utilization,
        "fund_capacity_status": partner['fund_capacity_status'],
        "npa_status": npa_status,
        "overdue_percentage": overdue_percentage,
        "routing_status": routing_status,
        "restriction_reason": restriction_reason,
        "contact_phone": partner['contact_phone'],
        "contact_email": partner['contact_email'],
        "branch_code": partner['branch_code']
    }

def get_routed_partner_pool(partners_list, scheme_id, user_lat=26.85, user_lon=80.94):
    evaluated = [evaluate_partner_routing(p, scheme_id, user_lat, user_lon) for p in partners_list]

    # Sort: Eligible first (by distance), then Restricted (by distance)
    eligible = sorted([p for p in evaluated if p['routing_status'] == 'Eligible'], key=lambda x: x['distance_km'])
    restricted = sorted([p for p in evaluated if p['routing_status'] == 'Restricted'], key=lambda x: x['distance_km'])

    return eligible + restricted
