import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import { Raleway } from 'next/font/google';

const raleway = Raleway({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] }); // Customize subsets and weights

export const metadata = {
  title: "Wifi Combat Admin",
  description: "Wifi Combat Admin Dashboard",
};

async function fetchToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value || null;
}

export default async function RootLayout({ children }) {
  const token = await fetchToken();

  // console.log(token);


  return (
    <html lang="en">
      <body className={`${raleway.className} antialiased`}>
        <div className={token ? 'dashboard-layout' : 'login-layout'}>
          {token && (
            <>
              <Topbar />
              <Sidebar />
            </>
          )}
          {children}
        </div>
      </body>
    </html>
  );
}
