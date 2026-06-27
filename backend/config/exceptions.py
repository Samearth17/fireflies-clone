from rest_framework import exceptions
from rest_framework.views import exception_handler


def api_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is None:
        return response

    if isinstance(exc, exceptions.ValidationError):
        response.data = {"error": "Validation failed", "details": response.data}
    elif isinstance(exc, exceptions.NotFound):
        response.data = {"error": "Not found", "details": response.data}
    elif isinstance(exc, exceptions.APIException):
        response.data = {"error": response.data.get("detail", "API error"), "details": response.data}
    return response
