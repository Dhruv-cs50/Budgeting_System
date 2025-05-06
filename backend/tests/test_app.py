import unittest
import json
from backend.app import app

class FlaskAppTestCase(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        """Runs once before all tests, setting up the Flask app context"""
        cls.app = app.test_client()  # Accessing the Flask test client
        cls.app.testing = True

    def test_get_all_users(self):
        """Test the /users route (GET request)"""
        response = self.app.get('/users')
        self.assertEqual(response.status_code, 200)
        self.assertGreater(len(response.json), 0)  # Ensure the list is not empty

    def test_get_user_by_email(self):
        """Test the /users/email/<email> route (GET request) when user exists"""
        response = self.app.get('/users/email/samuel@test.edu')
        self.assertEqual(response.status_code, 200)
        self.assertIn('email', response.json)  # Ensure 'email' is in the response

    def test_get_user_by_email_not_found(self):
        """Test the /users/email/<email> route (GET request) when user does not exist"""
        response = self.app.get('/users/email/nonexistent-email%40example.com')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json, {'error': 'User not found'})  # Error should be returned

    def test_update_user_by_email(self):
        """Test the /users/email/<email> route (PATCH request) to update a user's info"""
        update_data = {'name': 'Updated Name'}
        response = self.app.patch('/users/email/samuel@test.edu',
                                  data=json.dumps(update_data),
                                  content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {'message': 'User updated successfully'})  # Ensure update message

    def test_update_user_by_email_not_found(self):
        """Test the /users/email/<email> route (PATCH request) when user does not exist"""
        update_data = {'name': 'Updated Name'}
        response = self.app.patch('/users/email/nonexistent-email%40example.com',
                                  data=json.dumps(update_data),
                                  content_type='application/json')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json, {'error': 'User not found'})  # Error should be returned

    def test_add_goal(self):
        """Test the /users/<user_id>/goals route (POST request) to add a new goal"""
        new_goal = {'title': 'Save for Vacation', 'targetAmount': 1000, 'currentAmount': 200}
        response = self.app.post('/users/2/goals',
                                 data=json.dumps(new_goal),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertIn('goal', response.json)  # Ensure 'goal' is in the response

    def test_get_goals(self):
        """Test the /users/<user_id>/goals route (GET request) to get all goals for a user"""
        response = self.app.get('/users/2/goals')
        self.assertEqual(response.status_code, 200)
        self.assertIn('goals', response.json)  # Ensure 'goals' is in the response

    def test_update_goal_amount(self):
        """Test the /users/<user_id>/goals/<goal_id> route (PATCH request) to update a goal's amount"""
        update_data = {'amountToAdd': 100}
        response = self.app.patch('/users/2/goals/0',
                                  data=json.dumps(update_data),
                                  content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('goal', response.json)  # Ensure 'goal' is updated in the response

    def test_update_goal_amount_missing_field(self):
        """Test the /users/<user_id>/goals/<goal_id> route (PATCH request) with missing 'amountToAdd'"""
        response = self.app.patch('/users/2/goals/0', data=json.dumps({}), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json, {'error': 'Missing amountToAdd in request.'})  # Ensure missing field error

if __name__ == '__main__':
    unittest.main()