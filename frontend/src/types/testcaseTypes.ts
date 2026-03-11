export interface TestCase {
    test_id: string;
    scenario: string;
    steps: string[];
    expected_result: string;
    type: string;
    priority: string;
}

export interface TestCaseGenerationRequest {
    requirement: string;
}

export interface TestCaseGenerationResponse {
    test_cases: TestCase[];
}

export interface TestCaseDBModel extends TestCase {
    _id?: string;
    id?: string;
    suite_id?: string;
    suite_name?: string;
    requirement: string;
    created_at: string;
}
