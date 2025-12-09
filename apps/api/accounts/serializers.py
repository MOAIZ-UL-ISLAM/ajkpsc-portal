from rest_framework import serializers
from .models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate


class CNICLoginSerializer(TokenObtainPairSerializer):
    username_field = "cnic"  # Tells SimpleJWT that username is CNIC

    def validate(self, attrs):
        cnic = attrs.get("cnic")
        password = attrs.get("password")

        user = authenticate(username=cnic, password=password)

        if not user:
            raise serializers.ValidationError("Invalid CNIC or password")

        refresh = self.get_token(user)

        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "cnic": user.cnic,
                "email": user.email,
                "full_name": user.full_name,
                "user_id": str(user.user_id),
            }
        }


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        error_messages={
            "min_length": "Password must be at least 8 characters."}
    )
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "full_name",
            "email",
            "cnic",
            "gender",
            "dob",
            "password",
            "confirm_password",
        ]

    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError("Passwords do not match")
        return data

    def validate_cnic(self, value):
        if len(value) != 13 or not value.isdigit():
            raise serializers.ValidationError("CNIC must be a 13-digit number")
        return value

    def validate_password(self, value):
        if not any(c.isdigit() for c in value):
            raise serializers.ValidationError(
                "Password must contain at least one digit.")
        if not any(c.isalpha() for c in value):
            raise serializers.ValidationError(
                "Password must contain at least one letter.")
        return value

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        password = validated_data.pop("password")

        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
