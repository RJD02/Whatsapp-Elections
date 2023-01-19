#include <bits/stdc++.h>
using namespace std;

vector<int> findDataLocations(vector<int> locations, vector<int> movedFrom, vector<int> movedTo) {
	vector<int> ans;
	unordered_map<int, int> mp;
	for(auto i: locations)
		mp[i]++;
	for(int i = 0; i < movedTo.size(); i++) {
		mp[movedFrom[i]] = 0;
		mp[movedTo[i]] = 1;
	}
	for(auto i: mp) {
		if(i.second == 1)
			ans.push_back(i.first);
	}
	sort(ans.begin(), ans.end());
	return ans;
}

vector<string> implementAPI(vector<string> logs) {
	vector<string> messages;
	unordered_map<string, string> password;
	unordered_map<string, bool> isLoggedIn;
	unordered_set<string> registeredUsers;
	for(auto i: logs) {
		stringstream ss(i);
		string word;
		ss >> word;
		string command = word;
		ss >> word;
		string username = word;
		string userPassword;
		if(ss >> word)
			userPassword = word;
		if(command == "register") {
			if(registeredUsers.find(username) != registeredUsers.end()) {
				messages.push_back("Username already exists");
			} else {
				registeredUsers.insert(username);
				password[username] = userPassword;
			}
		} else if(command == "login") {
			if(registeredUsers.find(username) != registeredUsers.end()) {
				// there is a registered user with this username
				// now check if passwords match
				if(userPassword == password[username]) {
					// username and password match
					messages.push_back("Logged In Successfully");
					isLoggedIn[username] = true;
				} else {
					// passwords don't match
					messages.push_back("Login Unsuccessful");
				}
			} else {
				messages.push_back("Login Unsuccessful");
			} 
		} else {
			if(registeredUsers.find(username) != registeredUsers.end()) {
				// there is a user
				// check if he is logged in
				if(isLoggedIn[username]) {
					isLoggedIn[username] = false;
					messages.push_back("Logged Out Successfully");
				}
				else
					messages.push_back("Logout Unsuccessful");
			} else {
				messages.push_back("Logout Unsuccessful");
			}
		}

	}
	return messages;
}