import unittest
from backend.server import app

class TestBackend(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()

    def test_home_route(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)

    def test_prediction(self):
        sample_data = {
            "feature1": 1,
            "feature2": 0,
            "feature3": 45,
            # Add all required fields for prediction
        }
        response = self.app.post('/predict', json=sample_data)
        self.assertEqual(response.status_code, 200)
        self.assertIn("prediction", response.get_json())

if __name__ == "__main__":
    unittest.main()
