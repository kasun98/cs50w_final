from django import template

register = template.Library()

@register.filter
def multiply(value, arg):
    try:
        if value is None or arg is None:
            return ''
        result = float(value) * float(arg)
        return f"{result:.4f}"
    except (ValueError, TypeError):
        return ''
