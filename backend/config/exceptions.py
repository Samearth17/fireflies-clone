from django.http import Http404
from rest_framework import exceptions
from rest_framework.views import exception_handler


def api_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is None:
        return response

    if isinstance(exc, exceptions.ValidationError):
        response.data = {"error": "Validation failed", "details": response.data}
    elif isinstance(exc, (exceptions.NotFound, Http404)):
        response.data = {"error": "Not found", "details": response.data}
    elif isinstance(exc, exceptions.APIException):
        if isinstance(response.data, dict):
            message = response.data.get("detail", "API error")
        else:
            message = "API error"
        response.data = {"error": message, "details": response.data}
    return response
