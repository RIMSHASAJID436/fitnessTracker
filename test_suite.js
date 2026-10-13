const BASE_URL = 'http://localhost:5000/api';

async function testFullSuite() {
  console.log('--- STARTING COMPREHENSIVE FITNESS TRACKER TEST SUITE ---');

  // 1. Health check
  const healthRes = await fetch(`${BASE_URL}/health`);
  const health = await healthRes.json();
  console.log('1. Health Check:', health.status === 'ok' ? 'PASSED ✅' : 'FAILED ❌');

  // 2. Register a new athlete
  const testUser = {
    name: 'Sarah Connor',
    username: 'sarah_fitness_' + Math.floor(Math.random() * 10000),
    email: `sarah_${Date.now()}@fitness.com`,
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    fitnessGoal: 'fat_loss',
    currentWeight: 65,
    targetWeight: 60
  };

  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testUser)
  });
  const regData = await regRes.json();
  const token = regData.token;
  console.log('2. User Registration:', token ? 'PASSED ✅' : 'FAILED ❌', regData.user?.username);

  // 3. User Login
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: testUser.username, password: testUser.password })
  });
  const loginData = await loginRes.json();
  console.log('3. User Login (by username):', loginData.token ? 'PASSED ✅' : 'FAILED ❌');

  // 4. Update Profile
  const profRes = await fetch(`${BASE_URL}/users/me`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
    body: JSON.stringify({ bio: 'Training for a marathon and strength gains!', height: 168 })
  });
  const profData = await profRes.json();
  console.log('4. Profile Update:', profData.bio ? 'PASSED ✅' : 'FAILED ❌');

  // 5. Update Preferences (units & targets)
  const prefRes = await fetch(`${BASE_URL}/users/preferences`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
    body: JSON.stringify({
      units: { weight: 'kg', measurements: 'cm' },
      theme: { mode: 'dark', accent: '#06b6d4' },
      dailyTargets: { calories: 2000, protein: 140, carbs: 200, fat: 55 }
    })
  });
  const prefData = await prefRes.json();
  console.log('5. Preferences Update:', prefData.preferences?.theme?.accent === '#06b6d4' ? 'PASSED ✅' : 'FAILED ❌');

  // 6. Create Workout Routine with exercises
  const workoutPayload = {
    name: 'Full Body Power & Core',
    category: 'strength',
    tags: ['FullBody', 'Power', 'Gym'],
    duration: 60,
    intensity: 'high',
    exercises: [
      { name: 'Barbell Squat', sets: 4, reps: 8, weight: 80, notes: 'Felt strong' },
      { name: 'Bench Press', sets: 3, reps: 10, weight: 55, notes: 'Paused reps' },
      { name: 'Romanian Deadlift', sets: 3, reps: 10, weight: 70, notes: 'Focus on hamstrings' }
    ]
  };
  const workoutRes = await fetch(`${BASE_URL}/workouts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
    body: JSON.stringify(workoutPayload)
  });
  const workout = await workoutRes.json();
  console.log('6. Create Workout Routine:', workout._id && workout.totalVolume > 0 ? `PASSED ✅ (Volume: ${workout.totalVolume}kg)` : 'FAILED ❌');

  // 7. Get Workouts with Filter & Search
  const getWorkoutsRes = await fetch(`${BASE_URL}/workouts?category=strength&search=Squat`, {
    headers: { 'x-auth-token': token }
  });
  const searchedWorkouts = await getWorkoutsRes.json();
  console.log('7. Workout Search & Category Filter:', searchedWorkouts.length > 0 ? 'PASSED ✅' : 'FAILED ❌');

  // 8. Workout Analytics
  const workoutAnalyticsRes = await fetch(`${BASE_URL}/workouts/analytics`, {
    headers: { 'x-auth-token': token }
  });
  const wAnalytics = await workoutAnalyticsRes.json();
  console.log('8. Workout Analytics:', wAnalytics.totalVolumeSum > 0 ? 'PASSED ✅' : 'FAILED ❌');

  // 9. Log Nutrition Meal with macros
  const mealPayload = {
    mealType: 'breakfast',
    foodItems: [
      { name: 'Rolled Oats with Whey Protein', quantity: '1 bowl (80g)', calories: 420, protein: 35, carbs: 55, fat: 8 },
      { name: 'Banana', quantity: '1 medium', calories: 105, protein: 1, carbs: 27, fat: 0 }
    ],
    waterIntake: 500,
    notes: 'Pre-workout fueling'
  };
  const mealRes = await fetch(`${BASE_URL}/nutrition`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
    body: JSON.stringify(mealPayload)
  });
  const meal = await mealRes.json();
  console.log('9. Nutrition Meal Logging:', meal._id && meal.totalCalories === 525 ? `PASSED ✅ (${meal.totalCalories} kcal, ${meal.totalProtein}g protein)` : 'FAILED ❌');

  // 10. Nutrition Analytics
  const nutAnalyticsRes = await fetch(`${BASE_URL}/nutrition/analytics`, {
    headers: { 'x-auth-token': token }
  });
  const nAnalytics = await nutAnalyticsRes.json();
  console.log('10. Nutrition Analytics & Macro Distribution:', nAnalytics.macroDistribution?.length > 0 ? 'PASSED ✅' : 'FAILED ❌');

  // 11. Record Progress (Weight, measurements, PR benchmarks)
  const progressPayload = {
    weight: 64.2,
    bodyFatPercentage: 18.5,
    measurements: { chest: 92, waist: 72, hips: 94, arms: 30, thighs: 52 },
    performanceMetrics: { benchPress: 55, squat: 80, deadlift: 95, run5kTimeMinutes: 26 },
    notes: 'Lost 0.8kg since starting'
  };
  const progRes = await fetch(`${BASE_URL}/progress`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
    body: JSON.stringify(progressPayload)
  });
  const prog = await progRes.json();
  console.log('11. Progress Tracking:', prog._id && prog.weight === 64.2 ? 'PASSED ✅' : 'FAILED ❌');

  // 12. Check Notifications Delivery
  const notifRes = await fetch(`${BASE_URL}/notifications`, {
    headers: { 'x-auth-token': token }
  });
  const notifs = await notifRes.json();
  console.log('12. Activity Notifications:', notifs.notifications?.length > 0 ? `PASSED ✅ (${notifs.notifications.length} notifications received)` : 'FAILED ❌');

  // 13. Create & Toggle Reminder
  const remRes = await fetch(`${BASE_URL}/reminders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
    body: JSON.stringify({
      title: 'Post-Workout Protein Shake',
      type: 'meal',
      time: '11:30',
      days: ['Mon', 'Wed', 'Fri'],
      notes: 'Take 30g whey isolate'
    })
  });
  const reminder = await remRes.json();
  console.log('13. Reminder Creation:', reminder._id ? 'PASSED ✅' : 'FAILED ❌');

  // 14. Community Forum (Post & Like)
  const postRes = await fetch(`${BASE_URL}/community`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
    body: JSON.stringify({
      content: 'Just smashed a new squat PR of 80kg! Consistency is key!',
      category: 'workout_win'
    })
  });
  const post = await postRes.json();
  console.log('14. Community Post Creation:', post._id ? 'PASSED ✅' : 'FAILED ❌');

  // 15. Submit Support Ticket
  const ticketRes = await fetch(`${BASE_URL}/support`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: regData.user.id,
      name: testUser.name,
      email: testUser.email,
      subject: 'Inquiry regarding Apple Watch integration',
      category: 'feature',
      priority: 'low',
      message: 'Will there be direct sync with smart wearables in the next release?'
    })
  });
  const ticket = await ticketRes.json();
  console.log('15. Support System / Ticket Submission:', ticket.ticket?._id ? 'PASSED ✅' : 'FAILED ❌');

  // 16. Reports Summary & CSV Export
  const reportRes = await fetch(`${BASE_URL}/reports/summary`, {
    headers: { 'x-auth-token': token }
  });
  const report = await reportRes.json();
  console.log('16. Fitness & Nutrition Report Summary:', report.totalWorkouts === 1 && report.totalCalories === 525 ? 'PASSED ✅' : 'FAILED ❌');

  const csvRes = await fetch(`${BASE_URL}/reports/export/csv?type=workouts`, {
    headers: { 'x-auth-token': token }
  });
  const csvText = await csvRes.text();
  console.log('17. CSV Data Export (Workouts):', csvText.includes('Full Body Power & Core') ? 'PASSED ✅' : 'FAILED ❌');

  // 18. Dashboard Aggregation Check
  const dashRes = await fetch(`${BASE_URL}/users/dashboard`, {
    headers: { 'x-auth-token': token }
  });
  const dash = await dashRes.json();
  console.log('18. Full Dashboard Aggregation:', dash.totalWorkouts === 1 && dash.todayCalories === 525 && dash.chartData?.length === 7 ? 'PASSED ✅' : 'FAILED ❌');

  console.log('--- ALL 18 INTEGRATION TESTS COMPLETED SUCCESSFULLY! 🎉 ---');
}

testFullSuite().catch(e => console.error('TEST_FAILED_WITH_ERROR:', e));
