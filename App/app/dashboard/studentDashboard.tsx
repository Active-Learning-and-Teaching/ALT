import React from 'react';
import { SafeAreaView, ScrollView, Text, View, Button } from 'react-native';
import auth from '@react-native-firebase/auth';

function StudentDashboard() {
  // Sample data for courses
  const courses = [
    { name: 'Math 101', code: 'MATH101' },
    { name: 'Physics 201', code: 'PHYS201' },
    { name: 'Computer Science 101', code: 'CS101' },
    { name: 'Biology 105', code: 'BIO105' },
  ];

  const logout = async () => {
    await auth().signOut();
    console.log('Log out button pressed');
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9f9f9', padding: 10 }}>
      <ScrollView>
        <View style={{ padding: 20, backgroundColor: 'white', borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, elevation: 3 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Welcome to Your Dashboard</Text>
          <Text style={{ fontSize: 16, color: '#555' }}>Here are your current courses:</Text>
          
          {/* Display the list of courses */}
          {courses.map((course, index) => (
            <View key={index} style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
              <Text style={{ fontSize: 18, fontWeight: '500' }}>{course.name}</Text>
              <Text style={{ fontSize: 14, color: '#777' }}>{course.code}</Text>
            </View>
          ))}
          
          <Button title="Log Out" onPress={() => logout()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default StudentDashboard;
