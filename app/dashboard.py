from flask import Blueprint, flash, redirect, render_template, request, url_for
from flask_login import current_user, login_required

from sqlalchemy import or_

from . import db
from .models import GatewayResource


dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/")
@login_required
def index():
    query = GatewayResource.query.filter_by(owner_id=current_user.id).order_by(GatewayResource.created_at.desc())
    search = request.args.get("q", "").strip()
    if search:
        like_pattern = f"%{search}%"
        query = query.filter(
            or_(
                GatewayResource.name.ilike(like_pattern),
                GatewayResource.url.ilike(like_pattern),
                GatewayResource.description.ilike(like_pattern),
            )
        )
    resources = query.all()
    return render_template("dashboard/index.html", resources=resources, search=search)


@dashboard_bp.route("/resources/new", methods=["GET", "POST"])
@login_required
def create_resource():
    if request.method == "POST":
        name = request.form.get("name", "").strip()
        url = request.form.get("url", "").strip()
        description = request.form.get("description", "").strip()
        is_active = request.form.get("is_active") == "on"

        if not name or not url:
            flash("Nome e URL são obrigatórios.", "warning")
        else:
            resource = GatewayResource(
                name=name,
                url=url,
                description=description,
                is_active=is_active,
                owner_id=current_user.id,
            )
            db.session.add(resource)
            db.session.commit()
            flash("Recurso criado com sucesso!", "success")
            return redirect(url_for("dashboard.index"))

    return render_template("dashboard/resource_form.html", resource=None)


@dashboard_bp.route("/resources/<int:resource_id>/edit", methods=["GET", "POST"])
@login_required
def edit_resource(resource_id: int):
    resource = GatewayResource.query.filter_by(id=resource_id, owner_id=current_user.id).first_or_404()

    if request.method == "POST":
        name = request.form.get("name", "").strip()
        url = request.form.get("url", "").strip()
        description = request.form.get("description", "").strip()
        is_active = request.form.get("is_active") == "on"

        if not name or not url:
            flash("Nome e URL são obrigatórios.", "warning")
        else:
            resource.name = name
            resource.url = url
            resource.description = description
            resource.is_active = is_active
            db.session.commit()
            flash("Recurso atualizado!", "success")
            return redirect(url_for("dashboard.index"))

    return render_template("dashboard/resource_form.html", resource=resource)


@dashboard_bp.route("/resources/<int:resource_id>/delete", methods=["GET", "POST"])
@login_required
def delete_resource(resource_id: int):
    resource = GatewayResource.query.filter_by(id=resource_id, owner_id=current_user.id).first_or_404()

    if request.method == "POST":
        db.session.delete(resource)
        db.session.commit()
        flash("Recurso removido.", "info")
        return redirect(url_for("dashboard.index"))

    return render_template("dashboard/confirm_delete.html", resource=resource)
