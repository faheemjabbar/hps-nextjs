export default function DoctorDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome, Doctor!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-xl shadow">Upcoming Appointments</div>
        <div className="bg-white p-6 rounded-xl shadow">Assigned Patients</div>
      </div>
    </div>
  );
}
