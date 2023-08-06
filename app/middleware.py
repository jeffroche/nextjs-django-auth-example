import jwt
import requests
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractUser
from django.core.cache import cache
from django.conf import settings
from jwt.algorithms import RSAAlgorithm
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from typing import Dict, Tuple

User: AbstractUser = get_user_model()


class JWTAuthenticationMiddleware(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return None
        try:
            token = auth_header.split(" ")[1]
        except IndexError:
            raise AuthenticationFailed("Bearer token not provided.")
        user = self.decode_jwt(token)
        clerk = ClerkSDK()
        info, found = clerk.fetch_user_info(user.clerk_id)
        print(info)
        if not user:
            return None
        else:
            if found:
                user.email = info.get("email_address")
                user.first_name = info.get("first_name")
                user.last_name = info.get("last_name")
            user.save()

        return user, None

    def decode_jwt(self, token):
        clerk = ClerkSDK()
        jwks_data = clerk.get_jwks()
        public_key = RSAAlgorithm.from_jwk(jwks_data["keys"][0])
        try:
            payload = jwt.decode(
                token.encode("utf-8"),
                public_key,
                algorithms=["RS256"],
                options={"verify_signature": False},
            )
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token has expired.")
        except jwt.DecodeError:
            raise AuthenticationFailed("Token decode error.")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid token.")

        user_id = payload.get("sub")
        if user_id:
            user, _ = User.objects.get_or_create(clerk_id=user_id)
            return user
        return None


class ClerkSDK:
    def fetch_user_info(self, user_id: str) -> Tuple[Dict[str, str], bool]:
        url = f"{settings.CLERK_API_URL}/users/{user_id}"
        response = requests.get(
            url,
            headers={"Authorization": f"Bearer {settings.CLERK_SECRET_KEY}"},
        )
        if response.status_code == 200:
            data = response.json()
            return {
                "email_address": data["email_addresses"][0]["email_address"],
                "first_name": data["first_name"],
                "last_name": data["last_name"],
            }, True
        else:
            return {
                "email_address": "",
                "first_name": "",
                "last_name": "",
            }, False

    def get_jwks(self):
        jwks_data = cache.get(settings.CACHE_KEY)
        if not jwks_data:
            response = requests.get(settings.CLERK_FRONTEND_API_URL)
            if response.status_code == 200:
                jwks_data = response.json()
                print("JWKS Data: ", "* " * 30)
                print(jwks_data)
                cache.set(settings.CACHE_KEY, jwks_data)  # cache indefinitely
            else:
                raise AuthenticationFailed("Failed to fetch JWKS.")
        return jwks_data
