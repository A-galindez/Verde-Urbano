from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth.decorators import user_passes_test
from django.core import serializers
from django.http import HttpResponse
from django.views.decorators.http import require_GET
from django.apps import apps


@require_GET
@staff_member_required
@user_passes_test(lambda user: user.is_superuser)
def descargar_respaldo(request):
    modelos_excluidos = {
        "contenttypes.ContentType",
        "auth.Permission",
        "sessions.Session",
        "admin.LogEntry",
    }

    objetos = []

    for modelo in apps.get_models():
        nombre = f"{modelo._meta.app_label}.{modelo.__name__}"

        if nombre in modelos_excluidos:
            continue

        objetos.extend(modelo.objects.all())

    datos = serializers.serialize(
        "json",
        objetos,
        indent=2,
        use_natural_foreign_keys=True,
        use_natural_primary_keys=True,
    )

    respuesta = HttpResponse(
        datos,
        content_type="application/json",
    )

    respuesta["Content-Disposition"] = (
        'attachment; filename="respaldo_render.json"'
    )

    respuesta["Cache-Control"] = "no-store"

    return respuesta