"""Evaluates whether the forbidden constraints are breached."""

def validate_forbidden_constraint(response: str, forbidden: str) -> bool:
    """Returns True if the response contains the forbidden string (case-insensitive)."""
    if not response or not forbidden:
        return False
    return forbidden.lower() in response.lower()
