export default function PatientDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome, Patient!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-xl shadow">Upcoming Appointments</div>
        <div className="bg-white p-6 rounded-xl shadow">Assigned Doctor</div>
      </div>
    </div>
  );
}
