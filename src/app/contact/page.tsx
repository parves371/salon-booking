import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Header";

function page() {
  return (
    <>
      <Navbar />
      <section className="lg:mb-64 mb-10 md:mb-20">
        <div className="bg-[url('/images/demo-beauty-salon-title-bg.jpg')] bg-no-repeat bg-cover bg-center flex justify-center items-center h-[300px] text-white text-3xl">
          <h2>Contact us</h2>
        </div>
        <div className="container mx-auto mt-16 px-4 md:px-0">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl">
              <span className="bg-gradient-to-r from-[#2e3844] via-[#455161] to-[#e47256] text-transparent bg-clip-text font-bold">
                Book your appointment
              </span>
            </h2>
            <h4 className="text-2xl sm:text-3xl md:text-5xl w-full sm:w-[380px] mt-5">
              We would love to hear from you.
            </h4>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start mt-10 gap-16">
            <div className="w-full md:w-[60%] lg:w-[70%]">
              <div className="flex flex-col md:flex-row gap-10 md:gap-[100px]">
                <div className="flex-1">
                  <ul className="flex flex-col gap-3 text-lg">
                    <li>Visit beauty salon</li>
                    <div className="border-b py-2 border-black" />
                    <li className="text-[#7e8287]">401 Broadway, 24th Floor</li>
                    <li className="text-[#7e8287]">New York, NY 10013</li>
                  </ul>
                </div>
                <div className="flex-1">
                  <ul className="flex flex-col gap-3 text-lg">
                    <li>Book appointment</li>
                    <div className="border-b py-2 border-black" />
                    <li className="text-[#7e8287]">info@yourdomain.com</li>
                    <li className="text-[#7e8287]">booking@yourdomain.com</li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-10 md:gap-[100px] mt-10">
                <div className="flex-1">
                  <ul className="flex flex-col gap-3 text-lg">
                    <li>Let's talk with us</li>
                    <div className="border-b py-2 border-black" />
                    <li className="text-[#7e8287]">
                      <span className="text-black">Phone: </span> 1-800-222-000
                    </li>
                    <li className="text-[#7e8287]">
                      <span className="text-black">Fax: </span> 1-800-222-002
                    </li>
                  </ul>
                </div>
                <div className="flex-1">
                  <ul className="flex flex-col gap-3 text-lg">
                    <li>Opening hours</li>
                    <div className="border-b py-2 border-black" />
                    <li className="text-[#7e8287]">
                      <span className="text-black">Mon - Fri: </span> 09 am to
                      08 pm
                    </li>
                    <li className="text-[#7e8287]">
                      <span className="text-black">Sat - Sun: </span> 09 am to
                      06 pm
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="w-full md:w-[40%] bg-[#2E3844] p-6 sm:p-8 md:p-10 rounded-sm mt-8 md:mt-0">
              <h6 className="text-white text-3xl sm:text-4xl">Say hello!</h6>

              <div>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="w-full mt-6 p-4 outline-none bg-[#2E3844] border-b border-[#FF0000]"
                  placeholder="Enter your name*"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="w-full mt-6 p-4 outline-none bg-[#2E3844] border-b border-[#FF0000]"
                  placeholder="Enter your email address*"
                />
              </div>
              <div>
                <textarea
                  name="message"
                  id="message"
                  className="w-full mt-6 p-4 outline-none bg-[#2E3844] border-b border-[#434C57]"
                  placeholder="Enter your message*"
                ></textarea>
              </div>

              <button className="py-3 px-6 text-base bg-white rounded-md mt-6">
                Send message
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default page;
