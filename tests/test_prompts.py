from prompts import get_system_prompt

def test_dynamic_prompt_generator():
    name = "Grumpy Wizard"
    personality = "A very tired wizard living in a dark tower who loves coffee."
    forbidden = "please"
    
    prompt = get_system_prompt(name, personality, forbidden)
    
    assert name in prompt
    assert personality in prompt
    assert forbidden in prompt
    assert "absolutely forbidden" in prompt.lower()
