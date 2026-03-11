def build_testcase_prompt(requirement: str) -> str:
    return f"""You are a Senior QA Engineer with 15+ years of experience.
Your task is to analyze the following requirement and generate comprehensive test cases.
You must return a combination of Functional, Positive, Negative, Edge Cases, and Regression Tests.

Requirement:
"{requirement}"

You must return ONLY a JSON array containing the test cases. Do NOT include ANY markdown formatting like ```json. Do NOT include any accompanying text. Your response must begin with {{ and end with }}.

Format:
{{
  "test_cases": [
    {{
      "test_id": "TC_001",
      "scenario": "Login with valid credentials",
      "steps": [
        "Navigate to login page",
        "Enter valid email and password",
        "Click Login"
      ],
      "expected_result": "User is successfully logged in and redirected to dashboard",
      "type": "Positive",
      "priority": "High"
    }}
  ]
}}
"""
