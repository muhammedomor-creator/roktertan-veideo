import './globals.css';

export const metadata = {
  title: 'রক্তের টান - ভিডিও পোর্টাল',
  description: 'রক্তদান ও স্বাস্থ্য সচেতনতা ভিডিও গ্যালারি',
}

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  )
}