from datetime import timedelta
import os
import environ


# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

env = environ.Env(
    ON_SERVER=(bool, True), LOGGING_LEVEL=(str, "INFO"), DEBUG=(bool, False)
)
IGNORE_DOT_ENV_FILE = env.bool("IGNORE_DOT_ENV_FILE", default=False)
if not IGNORE_DOT_ENV_FILE:
    # reading .env file
    environ.Env.read_env(env_file=os.path.join(BASE_DIR, ".env"))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env("DEBUG")
ON_SERVER = env("ON_SERVER", default=True)

ALLOWED_HOSTS = ["*"]
CORS_ALLOW_CREDENTIALS = True
if ON_SERVER:
    CORS_ORIGIN_REGEX_WHITELIST = env.list(
        "CORS_ORIGIN_REGEX_WHITELIST", default=[]
    )
else:
    CORS_ORIGIN_ALLOW_ALL = True


# Application definition

DJANGO_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]
THIRD_PARTY_APPS = [
    "corsheaders",
    "django_extensions",
    "rest_framework",
    'rest_framework_simplejwt.token_blacklist'
]
OUR_APPS = [
    "api",
]
INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + OUR_APPS

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

if not ON_SERVER:
    INSTALLED_APPS.append("debug_toolbar")
    MIDDLEWARE.insert(9, "debug_toolbar.middleware.DebugToolbarMiddleware")
    INTERNAL_IPS = [
        '127.0.0.1',
    ]

ROOT_URLCONF = "api.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ]
        },
    }
]

WSGI_APPLICATION = "app.wsgi.application"


# Database
# https://docs.djangoproject.com/en/2.0/ref/settings/#databases

DATABASES = {
    "default": env.db(),
}

# Password validation
# https://docs.djangoproject.com/en/2.0/ref/settings/#auth-password-validators

password_validators = [
    "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    "django.contrib.auth.password_validation.MinimumLengthValidator",
    "django.contrib.auth.password_validation.CommonPasswordValidator",
    "django.contrib.auth.password_validation.NumericPasswordValidator",
]
AUTH_PASSWORD_VALIDATORS = [{"NAME": v} for v in password_validators]
AUTH_USER_MODEL = "api.User"

# Internationalization
# https://docs.djangoproject.com/en/2.0/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.0/howto/static-files/

STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
STATIC_URL = "/static/"

if ON_SERVER:
    STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
    STATIC_URL = "/static/"
    MIDDLEWARE = tuple(
        ["whitenoise.middleware.WhiteNoiseMiddleware"] + list(MIDDLEWARE)
    )
    STATICFILES_STORAGE = \
        "whitenoise.storage.CompressedManifestStaticFilesStorage"


LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": (
                "%(asctime)s [%(process)d] [%(levelname)s] "
                + "pathname=%(pathname)s lineno=%(lineno)s "
                + "funcname=%(funcName)s %(message)s"
            ),
            "datefmt": "%Y-%m-%d %H:%M:%S",
        },
        "simple": {"format": "%(levelname)s %(message)s"},
    },
    "handlers": {
        "null": {"level": "DEBUG", "class": "logging.NullHandler", },
        "console": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
    },
    "loggers": {
        "app": {
            "handlers": ["console"],
            "level": env("LOGGING_LEVEL"),
        }
    },
}

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.BasicAuthentication",
    )
}

# JWT Settings
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=30),
}
JWT_COOKIE_NAME = env.str("JWT_COOKIE_NAME", default="refresh_token")
JWT_COOKIE_SECURE = env.bool("JWT_COOKIE_SECURE", default=False)
JWT_COOKIE_SAMESITE = env.str("JWT_COOKIE_SAMESITE", default="Lax")

if ON_SERVER:
    # HTTPS
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SECURE_SSL_REDIRECT = True
