from flask import Blueprint, flash, redirect, render_template, request, url_for
from flask_login import current_user, login_required, login_user, logout_user

from . import db
from .models import User

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


def _redirect_if_authenticated():
    if current_user.is_authenticated:
        return redirect(url_for("dashboard.index"))
    return None


@auth_bp.route("/login", methods=["GET", "POST"])
def login():
    redirect_response = _redirect_if_authenticated()
    if redirect_response:
        return redirect_response

    if request.method == "POST":
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")

        user = User.query.filter_by(email=email).first()
        if user and user.check_password(password):
            login_user(user)
            flash("Login realizado com sucesso!", "success")
            next_page = request.args.get("next")
            return redirect(next_page or url_for("dashboard.index"))
        flash("Credenciais inválidas.", "danger")

    return render_template("auth/login.html")


@auth_bp.route("/register", methods=["GET", "POST"])
def register():
    redirect_response = _redirect_if_authenticated()
    if redirect_response:
        return redirect_response

    if request.method == "POST":
        name = request.form.get("name", "").strip()
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")
        confirm_password = request.form.get("confirm_password", "")

        if not name or not email or not password:
            flash("Todos os campos são obrigatórios.", "warning")
        elif password != confirm_password:
            flash("As senhas não conferem.", "warning")
        elif User.query.filter_by(email=email).first():
            flash("Já existe um usuário com este e-mail.", "warning")
        else:
            user = User(name=name, email=email)
            user.set_password(password)
            db.session.add(user)
            db.session.commit()
            flash("Cadastro realizado! Você já pode fazer login.", "success")
            return redirect(url_for("auth.login"))

    return render_template("auth/register.html")


@auth_bp.route("/logout")
@login_required
def logout():
    logout_user()
    flash("Sessão encerrada.", "info")
    return redirect(url_for("auth.login"))
