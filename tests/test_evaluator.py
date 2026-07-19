from evaluator import validate_forbidden_constraint

def test_validate_forbidden_constraint():
    # Case 1: contains forbidden word
    assert validate_forbidden_constraint("I would please ask you to leave.", "please") is True
    # Case 2: does not contain forbidden word
    assert validate_forbidden_constraint("I cannot do that.", "please") is False
    # Case 3: case-insensitivity
    assert validate_forbidden_constraint("PLEASE do not do that.", "please") is True
    # Case 4: empty inputs
    assert validate_forbidden_constraint("", "please") is False
    assert validate_forbidden_constraint("Hello", "") is False
