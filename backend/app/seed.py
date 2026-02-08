from datetime import datetime

from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models import (
    AttributionBundle,
    CausePattern,
    CounterfactualBundle,
    CausalGraph,
    Control,
    DailyMetric,
    Incident,
    RepeatRateTrend,
    Report,
    Risk,
    ServiceCauseMatrix,
    User,
)


def seed_data(db: Session) -> None:
    if not db.query(User).first():
        user = User(
            name="Jeyapragash",
            email="admin@efce.local",
            org="EFCE",
            avatar_url=None,
            hashed_password=hash_password("admin123"),
        )
        db.add(user)

    if not db.query(Incident).first():
        incidents = [
            Incident(
                id="INC-001",
                title="Deployment cascade failure",
                service="payments-api",
                severity="SEV1",
                status="RESOLVED",
                started_at=datetime.fromisoformat("2026-01-30T11:05:00+05:30"),
                duration_min=70,
            ),
            Incident(
                id="INC-002",
                title="Config drift caused memory spike",
                service="orders-api",
                severity="SEV2",
                status="OPEN",
                started_at=datetime.fromisoformat("2026-01-31T10:10:00+05:30"),
                duration_min=25,
            ),
        ]
        db.add_all(incidents)

    if not db.query(Risk).first():
        risks = [
            Risk(
                id="RISK-01",
                risk="Unreviewed deployments in prod",
                owner="SRE",
                level="HIGH",
                status="OPEN",
            ),
            Risk(
                id="RISK-02",
                risk="Manual config drift",
                owner="Platform",
                level="MEDIUM",
                status="OPEN",
            ),
            Risk(
                id="RISK-03",
                risk="Alert fatigue / missing ACK SLA",
                owner="Ops",
                level="HIGH",
                status="IN PROGRESS",
            ),
            Risk(
                id="RISK-04",
                risk="Missing rate-limits on critical endpoints",
                owner="Backend",
                level="MEDIUM",
                status="OPEN",
            ),
        ]
        db.add_all(risks)

    if not db.query(Report).first():
        reports = [
            Report(
                id="RPT-001",
                title="Incident Report — INC-001",
                type="Incident",
                date="2026-01-31",
                tags=["Incident", "PDF"],
            ),
            Report(
                id="RPT-002",
                title="Weekly Executive Summary",
                type="Executive",
                date="2026-01-31",
                tags=["Executive", "Summary"],
            ),
            Report(
                id="RPT-003",
                title="Risk Review Pack",
                type="Risk",
                date="2026-01-30",
                tags=["Risk", "Registry"],
            ),
        ]
        db.add_all(reports)

    if not db.query(DailyMetric).first():
        metrics = [
            DailyMetric(date="2026-01-25", incidents=1, mttr=45),
            DailyMetric(date="2026-01-26", incidents=0, mttr=0),
            DailyMetric(date="2026-01-27", incidents=2, mttr=62),
            DailyMetric(date="2026-01-28", incidents=1, mttr=38),
            DailyMetric(date="2026-01-29", incidents=3, mttr=71),
            DailyMetric(date="2026-01-30", incidents=1, mttr=58),
            DailyMetric(date="2026-01-31", incidents=1, mttr=49),
        ]
        db.add_all(metrics)

    if not db.query(CausePattern).first():
        patterns = [
            CausePattern(cause="Deployment override without rollback plan", count=9, avg_impact="HIGH"),
            CausePattern(cause="Alert not acknowledged within SLA", count=7, avg_impact="HIGH"),
            CausePattern(cause="Manual production config changes (drift)", count=6, avg_impact="MEDIUM"),
            CausePattern(cause="Insufficient CI coverage on critical path", count=5, avg_impact="MEDIUM"),
            CausePattern(cause="Missing rate-limits / traffic spikes", count=4, avg_impact="LOW"),
        ]
        db.add_all(patterns)

    if not db.query(ServiceCauseMatrix).first():
        matrix = [
            ("payments-api", "Deployment override without rollback plan", 4),
            ("payments-api", "Alert not acknowledged within SLA", 3),
            ("payments-api", "Manual production config changes (drift)", 2),
            ("payments-api", "Insufficient CI coverage on critical path", 2),
            ("orders-api", "Deployment override without rollback plan", 2),
            ("orders-api", "Alert not acknowledged within SLA", 2),
            ("orders-api", "Manual production config changes (drift)", 2),
            ("orders-api", "Insufficient CI coverage on critical path", 1),
            ("auth-service", "Deployment override without rollback plan", 1),
            ("auth-service", "Alert not acknowledged within SLA", 1),
            ("auth-service", "Manual production config changes (drift)", 1),
            ("auth-service", "Insufficient CI coverage on critical path", 2),
            ("inventory-api", "Deployment override without rollback plan", 2),
            ("inventory-api", "Alert not acknowledged within SLA", 1),
            ("inventory-api", "Manual production config changes (drift)", 1),
            ("inventory-api", "Insufficient CI coverage on critical path", 0),
        ]
        db.add_all(
            [
                ServiceCauseMatrix(service=svc, cause=cause, count=count)
                for svc, cause, count in matrix
            ]
        )

    if not db.query(RepeatRateTrend).first():
        repeat_rates = [
            RepeatRateTrend(date="2026-01-25", repeat_rate=18),
            RepeatRateTrend(date="2026-01-26", repeat_rate=22),
            RepeatRateTrend(date="2026-01-27", repeat_rate=20),
            RepeatRateTrend(date="2026-01-28", repeat_rate=27),
            RepeatRateTrend(date="2026-01-29", repeat_rate=31),
            RepeatRateTrend(date="2026-01-30", repeat_rate=28),
            RepeatRateTrend(date="2026-01-31", repeat_rate=34),
        ]
        db.add_all(repeat_rates)

    if not db.query(CausalGraph).first():
        nodes = [
            {
                "id": "fail",
                "position": {"x": 560, "y": 220},
                "data": {
                    "label": "Service Outage (Failure)",
                    "meta": {
                        "eventType": "FAILURE",
                        "timestamp": "2026-01-30T11:00:00+05:30",
                        "actor": "system",
                        "system": "payments-api",
                        "risk": 1.0,
                        "notes": "Requests failing with 5xx. User impact high.",
                    },
                },
                "style": {"borderRadius": 12, "padding": 10},
            },
            {
                "id": "alert",
                "position": {"x": 300, "y": 220},
                "data": {
                    "label": "Alert not acknowledged",
                    "meta": {
                        "eventType": "ALERT",
                        "timestamp": "2026-01-30T10:05:00+05:30",
                        "actor": "on-call",
                        "system": "payments-api",
                        "risk": 0.75,
                        "notes": "Memory spike alert fired; no ACK within SLA.",
                    },
                },
                "style": {"borderRadius": 12, "padding": 10},
            },
            {
                "id": "config",
                "position": {"x": 80, "y": 220},
                "data": {
                    "label": "Manual config override",
                    "meta": {
                        "eventType": "CONFIG",
                        "timestamp": "2026-01-30T09:35:00+05:30",
                        "actor": "human",
                        "system": "payments-api",
                        "risk": 0.8,
                        "notes": "Manual change in prod caused drift from desired state.",
                    },
                },
                "style": {"borderRadius": 12, "padding": 10},
            },
            {
                "id": "deploy",
                "position": {"x": 80, "y": 80},
                "data": {
                    "label": "Late-night deployment override",
                    "meta": {
                        "eventType": "DEPLOYMENT",
                        "timestamp": "2026-01-30T09:30:00+05:30",
                        "actor": "release manager",
                        "system": "payments-api",
                        "risk": 0.85,
                        "notes": "Deployment forced despite partial test failures.",
                    },
                },
                "style": {"borderRadius": 12, "padding": 10},
            },
            {
                "id": "commit",
                "position": {"x": 300, "y": 80},
                "data": {
                    "label": "Large unreviewed commit",
                    "meta": {
                        "eventType": "CODE_CHANGE",
                        "timestamp": "2026-01-30T09:00:00+05:30",
                        "actor": "developer",
                        "system": "payments-api",
                        "risk": 0.7,
                        "notes": "Large diff; review skipped due to urgency.",
                    },
                },
                "style": {"borderRadius": 12, "padding": 10},
            },
        ]
        edges = [
            {"id": "e1", "source": "commit", "target": "deploy", "label": "0.7", "animated": True},
            {"id": "e2", "source": "deploy", "target": "config", "label": "0.9", "animated": True},
            {"id": "e3", "source": "config", "target": "alert", "label": "0.8", "animated": True},
            {"id": "e4", "source": "alert", "target": "fail", "label": "0.85", "animated": True},
        ]
        db.add(
            CausalGraph(
                incident_id="INC-001",
                nodes=nodes,
                edges=edges,
            )
        )

    if not db.query(AttributionBundle).first():
        attribution = [
            {"factor": "Deployment override without rollback plan", "contribution": 42, "type": "Process"},
            {"factor": "Alert not acknowledged (fatigue/overload)", "contribution": 23, "type": "Operations"},
            {"factor": "Insufficient test coverage on critical path", "contribution": 19, "type": "Engineering"},
            {"factor": "Manual config override (config drift)", "contribution": 16, "type": "Technical"},
        ]
        db.add(AttributionBundle(incident_id="INC-001", items=attribution))

    if not db.query(CounterfactualBundle).first():
        counterfactuals = [
            {"id": "cf-deploy", "label": "Block late-night deployment overrides", "delta": -55},
            {"id": "cf-alert", "label": "Require alert acknowledgement within 5 minutes", "delta": -40},
            {"id": "cf-config", "label": "Prevent manual production config changes", "delta": -35},
            {"id": "cf-tests", "label": "Enforce CI test pass for critical services", "delta": -28},
        ]
        db.add(CounterfactualBundle(incident_id="INC-001", items=counterfactuals))

    if not db.query(Control).first():
        controls = [
            Control(name="Deploy freeze window policy", category="Process"),
            Control(name="Mandatory rollback plan", category="Engineering"),
            Control(name="No-manual-config in prod (policy)", category="Platform"),
            Control(name="Alert ACK SLA + escalation", category="Ops"),
        ]
        db.add_all(controls)

    db.commit()
