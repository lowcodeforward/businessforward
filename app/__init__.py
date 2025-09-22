from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash

# Initialize extensions
db = SQLAlchemy()
login_manager = LoginManager()
migrate = Migrate()


def create_app(test_config: dict | None = None) -> Flask:
    """Application factory for the gateway web app."""
    app = Flask(__name__, instance_relative_config=False)
    app.config.from_mapping(
        SECRET_KEY="change-me",
        SQLALCHEMY_DATABASE_URI="sqlite:///gateway.db",
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
    )

    if test_config:
        app.config.update(test_config)

    db.init_app(app)
    login_manager.init_app(app)
    migrate.init_app(app, db)

    login_manager.login_view = "auth.login"

    from . import models  # noqa: F401
    from .auth import auth_bp
    from .dashboard import dashboard_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(dashboard_bp)

    @app.cli.command("init-db")
    def init_db_command():
        """Create database tables and a default admin user."""
        from .models import User

        db.create_all()
        if not User.query.filter_by(email="admin@gateway.local").first():
            user = User(
                name="Administrador",
                email="admin@gateway.local",
                password_hash=generate_password_hash("admin123", method="pbkdf2:sha256"),
            )
            db.session.add(user)
            db.session.commit()
            print("Created default admin user admin@gateway.local / admin123")
        else:
            print("Default admin user already exists")

    return app


@login_manager.user_loader
def load_user(user_id: str):
    from .models import User

    return db.session.get(User, int(user_id))
