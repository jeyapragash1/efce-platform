"""Initial schema

Revision ID: 0001_initial
Revises: 
Create Date: 2026-02-08

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("org", sa.String(length=255), nullable=True),
        sa.Column("avatar_url", sa.String(length=1024), nullable=True),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("is_admin", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_users_id", "users", ["id"], unique=False)
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    op.create_table(
        "incidents",
        sa.Column("id", sa.String(length=40), primary_key=True),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("service", sa.String(length=120), nullable=False),
        sa.Column("severity", sa.String(length=10), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("duration_min", sa.Integer(), nullable=False),
    )
    op.create_index("ix_incidents_id", "incidents", ["id"], unique=False)

    op.create_table(
        "risks",
        sa.Column("id", sa.String(length=40), primary_key=True),
        sa.Column("risk", sa.String(length=255), nullable=False),
        sa.Column("owner", sa.String(length=120), nullable=False),
        sa.Column("level", sa.String(length=20), nullable=False),
        sa.Column("status", sa.String(length=30), nullable=False),
    )
    op.create_index("ix_risks_id", "risks", ["id"], unique=False)

    op.create_table(
        "reports",
        sa.Column("id", sa.String(length=40), primary_key=True),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("type", sa.String(length=50), nullable=False),
        sa.Column("date", sa.String(length=20), nullable=False),
        sa.Column("tags", sa.JSON(), nullable=False),
    )
    op.create_index("ix_reports_id", "reports", ["id"], unique=False)

    op.create_table(
        "daily_metrics",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("date", sa.String(length=20), nullable=False),
        sa.Column("incidents", sa.Integer(), nullable=False),
        sa.Column("mttr", sa.Integer(), nullable=False),
    )
    op.create_index("ix_daily_metrics_id", "daily_metrics", ["id"], unique=False)

    op.create_table(
        "cause_patterns",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("cause", sa.String(length=255), nullable=False),
        sa.Column("count", sa.Integer(), nullable=False),
        sa.Column("avg_impact", sa.String(length=20), nullable=False),
    )
    op.create_index("ix_cause_patterns_id", "cause_patterns", ["id"], unique=False)

    op.create_table(
        "service_cause_matrix",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("service", sa.String(length=120), nullable=False),
        sa.Column("cause", sa.String(length=255), nullable=False),
        sa.Column("count", sa.Integer(), nullable=False),
    )
    op.create_index("ix_service_cause_matrix_id", "service_cause_matrix", ["id"], unique=False)

    op.create_table(
        "repeat_rate_trend",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("date", sa.String(length=20), nullable=False),
        sa.Column("repeat_rate", sa.Integer(), nullable=False),
    )
    op.create_index("ix_repeat_rate_trend_id", "repeat_rate_trend", ["id"], unique=False)

    op.create_table(
        "causal_graphs",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("incident_id", sa.String(length=40), nullable=False),
        sa.Column("nodes", sa.JSON(), nullable=False),
        sa.Column("edges", sa.JSON(), nullable=False),
    )
    op.create_index("ix_causal_graphs_id", "causal_graphs", ["id"], unique=False)
    op.create_index("ix_causal_graphs_incident_id", "causal_graphs", ["incident_id"], unique=False)

    op.create_table(
        "analysis_attributions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("incident_id", sa.String(length=40), nullable=False),
        sa.Column("items", sa.JSON(), nullable=False),
    )
    op.create_index("ix_analysis_attributions_id", "analysis_attributions", ["id"], unique=False)
    op.create_index("ix_analysis_attributions_incident_id", "analysis_attributions", ["incident_id"], unique=False)

    op.create_table(
        "analysis_counterfactuals",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("incident_id", sa.String(length=40), nullable=False),
        sa.Column("items", sa.JSON(), nullable=False),
    )
    op.create_index("ix_analysis_counterfactuals_id", "analysis_counterfactuals", ["id"], unique=False)
    op.create_index("ix_analysis_counterfactuals_incident_id", "analysis_counterfactuals", ["incident_id"], unique=False)

    op.create_table(
        "controls",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("category", sa.String(length=120), nullable=False),
    )
    op.create_index("ix_controls_id", "controls", ["id"], unique=False)

    op.create_table(
        "notifications",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("message", sa.String(length=500), nullable=False),
        sa.Column("type", sa.String(length=20), nullable=True),
        sa.Column("read", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_notifications_id", "notifications", ["id"], unique=False)
    op.create_index("ix_notifications_user_id", "notifications", ["user_id"], unique=False)

    op.create_table(
        "onboarding_state",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("step", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("dismissed", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_onboarding_state_id", "onboarding_state", ["id"], unique=False)
    op.create_index("ix_onboarding_state_user_id", "onboarding_state", ["user_id"], unique=False)

    op.create_table(
        "scenarios",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("state", sa.JSON(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_scenarios_id", "scenarios", ["id"], unique=False)
    op.create_index("ix_scenarios_user_id", "scenarios", ["user_id"], unique=False)

    op.create_table(
        "graph_studio_state",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("nodes", sa.JSON(), nullable=False),
        sa.Column("edges", sa.JSON(), nullable=False),
        sa.Column("evidence", sa.JSON(), nullable=False),
        sa.Column("versions", sa.JSON(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_graph_studio_state_id", "graph_studio_state", ["id"], unique=False)
    op.create_index("ix_graph_studio_state_user_id", "graph_studio_state", ["user_id"], unique=False)

    op.create_table(
        "report_exports",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("incident_id", sa.String(length=40), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_report_exports_id", "report_exports", ["id"], unique=False)
    op.create_index("ix_report_exports_user_id", "report_exports", ["user_id"], unique=False)
    op.create_index("ix_report_exports_incident_id", "report_exports", ["incident_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_report_exports_incident_id", table_name="report_exports")
    op.drop_index("ix_report_exports_user_id", table_name="report_exports")
    op.drop_index("ix_report_exports_id", table_name="report_exports")
    op.drop_table("report_exports")

    op.drop_index("ix_graph_studio_state_user_id", table_name="graph_studio_state")
    op.drop_index("ix_graph_studio_state_id", table_name="graph_studio_state")
    op.drop_table("graph_studio_state")

    op.drop_index("ix_scenarios_user_id", table_name="scenarios")
    op.drop_index("ix_scenarios_id", table_name="scenarios")
    op.drop_table("scenarios")

    op.drop_index("ix_onboarding_state_user_id", table_name="onboarding_state")
    op.drop_index("ix_onboarding_state_id", table_name="onboarding_state")
    op.drop_table("onboarding_state")

    op.drop_index("ix_notifications_user_id", table_name="notifications")
    op.drop_index("ix_notifications_id", table_name="notifications")
    op.drop_table("notifications")

    op.drop_index("ix_controls_id", table_name="controls")
    op.drop_table("controls")

    op.drop_index("ix_analysis_counterfactuals_incident_id", table_name="analysis_counterfactuals")
    op.drop_index("ix_analysis_counterfactuals_id", table_name="analysis_counterfactuals")
    op.drop_table("analysis_counterfactuals")

    op.drop_index("ix_analysis_attributions_incident_id", table_name="analysis_attributions")
    op.drop_index("ix_analysis_attributions_id", table_name="analysis_attributions")
    op.drop_table("analysis_attributions")

    op.drop_index("ix_causal_graphs_incident_id", table_name="causal_graphs")
    op.drop_index("ix_causal_graphs_id", table_name="causal_graphs")
    op.drop_table("causal_graphs")

    op.drop_index("ix_repeat_rate_trend_id", table_name="repeat_rate_trend")
    op.drop_table("repeat_rate_trend")

    op.drop_index("ix_service_cause_matrix_id", table_name="service_cause_matrix")
    op.drop_table("service_cause_matrix")

    op.drop_index("ix_cause_patterns_id", table_name="cause_patterns")
    op.drop_table("cause_patterns")

    op.drop_index("ix_daily_metrics_id", table_name="daily_metrics")
    op.drop_table("daily_metrics")

    op.drop_index("ix_reports_id", table_name="reports")
    op.drop_table("reports")

    op.drop_index("ix_risks_id", table_name="risks")
    op.drop_table("risks")

    op.drop_index("ix_incidents_id", table_name="incidents")
    op.drop_table("incidents")

    op.drop_index("ix_users_email", table_name="users")
    op.drop_index("ix_users_id", table_name="users")
    op.drop_table("users")
