// సేవలు - Mock Data (Backend connect అయిన తర్వాత API calls చేయండి)

export const mockBookings = [
  { id: 1, farmer: 'రామయ్య', village: 'నల్లగొండ', nagaliType: 'గొర్రు', acres: 3, ratePerAcre: 800, date: '2025-01-15', paid: true, totalAmount: 2400 },
  { id: 2, farmer: 'వెంకటేశ్వర రావు', village: 'మిర్యాలగూడ', nagaliType: 'మిరప గొర్రు', acres: 2, ratePerAcre: 1000, date: '2025-01-16', paid: false, totalAmount: 2000 },
  { id: 3, farmer: 'లక్ష్మయ్య', village: 'సూర్యాపేట', nagaliType: 'వితనం గొర్రు', acres: 5, ratePerAcre: 900, date: '2025-01-17', paid: true, totalAmount: 4500 },
  { id: 4, farmer: 'నరసింహారావు', village: 'హాలియా', nagaliType: 'బోతె గొర్రు', acres: 4, ratePerAcre: 850, date: '2025-01-18', paid: false, totalAmount: 3400 },
  { id: 5, farmer: 'సుబ్బారావు', village: 'తిరుమలగిరి', nagaliType: 'గొర్రు', acres: 2.5, ratePerAcre: 800, date: '2025-01-19', paid: true, totalAmount: 2000 },
]

export const mockFarmers = [
  { id: 1, name: 'రామయ్య', phone: '9876543210', village: 'నల్లగొండ', totalAcres: 8, totalDue: 0, totalPaid: 5200 },
  { id: 2, name: 'వెంకటేశ్వర రావు', phone: '9876543211', village: 'మిర్యాలగూడ', totalAcres: 5, totalDue: 2000, totalPaid: 3000 },
  { id: 3, name: 'లక్ష్మయ్య', phone: '9876543212', village: 'సూర్యాపేట', totalAcres: 12, totalDue: 0, totalPaid: 9200 },
  { id: 4, name: 'నరసింహారావు', phone: '9876543213', village: 'హాలియా', totalAcres: 7, totalDue: 3400, totalPaid: 1500 },
  { id: 5, name: 'సుబ్బారావు', phone: '9876543214', village: 'తిరుమలగిరి', totalAcres: 6, totalDue: 0, totalPaid: 4800 },
]

export const mockExpenses = [
  { id: 1, type: 'డీజిల్', amount: 3500, date: '2025-01-15', note: '50 లీటర్లు @ ₹70' },
  { id: 2, type: 'Maintenance', amount: 2000, date: '2025-01-16', note: 'Oil change + filter' },
  { id: 3, type: 'Driver జీతం', amount: 12000, date: '2025-01-01', note: 'January జీతం' },
  { id: 4, type: 'డీజిల్', amount: 2800, date: '2025-01-18', note: '40 లీటర్లు @ ₹70' },
  { id: 5, type: 'Spare parts', amount: 1500, date: '2025-01-20', note: 'Tyre repair' },
]

export const nagaliTypes = ['గొర్రు', 'మిరప గొర్రు', 'వితనం గొర్రు', 'బోతె గొర్రు']

export const nagaliRates = {
  'గొర్రు': 800,
  'మిరప గొర్రు': 1000,
  'వితనం గొర్రు': 900,
  'బోతె గొర్రు': 850,
}

// Dashboard summary
export function getDashboardStats(bookings, expenses) {
  const totalIncome = bookings.reduce((s, b) => s + b.totalAmount, 0)
  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0)
  const totalDue = bookings.filter(b => !b.paid).reduce((s, b) => s + b.totalAmount, 0)
  const totalAcres = bookings.reduce((s, b) => s + b.acres, 0)
  return { totalIncome, totalExpense, totalDue, totalAcres, netProfit: totalIncome - totalExpense }
}
