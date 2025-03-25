const Contact= () => {
return (
    <div className="min-h-screen bg-white mt-10">
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12 text-center">
                    <h2 className="text-4xl font-bold text-black mb-4">Contact Us</h2>
                    <p className="text-lg text-gray-600">Have questions or feedback? We'd love to hear from you!</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-orange-400 text-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold mb-6">Get In Touch</h3>

                        <div className="mb-6">
                            <h4 className="text-xl font-semibold mb-2">Address</h4>
                            <p>123 xyz</p>
                        </div>

                        <div className="mb-6">
                            <h4 className="text-xl font-semibold mb-2">Email</h4>
                            <p>support@wanderwise.com</p>
                        </div>

                        <div className="mb-6">
                            <h4 className="text-xl font-semibold mb-2">Phone</h4>
                            <p>+91 1234567890</p>
                        </div>

                        <div>
                            <h4 className="text-xl font-semibold mb-2">Hours</h4>
                            <p>Monday - Friday: 9AM - 6PM</p>
                            <p>Saturday: 10AM - 4PM</p>
                            <p>Sunday: Closed</p>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-lg">
                        <form action="#" >
                            <div className="mb-4">
                                <label className="block text-black font-medium mb-2">Name</label>
                                <input type="text" id="name" name="name"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-black font-medium mb-2">Email</label>
                                <input type="email" id="email" name="email"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-black font-medium mb-2">Subject</label>
                                <input type="text" id="subject" name="subject"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-black font-medium mb-2">Message</label>
                                <textarea id="message" name="message" rows="5"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                                    required
                                ></textarea>
                            </div>

                            <button type="submit" className="w-full bg-orange-400 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
};

export default Contact;