import {Link} from "react-router-dom";
import React from "react";

const About = () => {
    return (
        <>
            <div className={`flex flex-col items-center justify-center mt-20`}>
                <div className={`text-center mb-20`}>
                    <h3 className={`text-4xl font-bold mb-6 mt-4`}> About WanderWise </h3>
                    <p className={`text-2xl text-gray-500 max-w-3xl`}>Your trusted companion in creating unforgettable
                        travel experiences. We make trip planning simple, smart, and personalized.</p>
                </div>
                <div className={`flex flex-row items-center justify-center py-15 bg-gray-50 w-full`}>
                    <div className={`ml-2 flex flex-col flex-start justify-center max-w-xl`}>
                        <h3 className={`text-4xl font-semibold mb-6`}>Our Mission</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci commodi distinctio ducimus
                            est magni nostrum odio omnis praesentium quam quas quibusdam, quisquam suscipit temporibus
                            ullam veniam vero voluptatem. Aspernatur aut est facilis hic nisi odit, porro.</p>
                    </div>
                    <div className={`flex flex-row items-center`}>
                        <img src="https://placehold.co/400x200" alt="img" className={`rounded-2xl`}/>
                    </div>
                </div>
                <div className={`text-center mb-20 mt-20 `}>
                    <p className={`text-4xl font-semibold mb-6`}>Why Choose Us?</p>
                    <p className={`text-xl text-gray-500 max-w-3xl`}>Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Amet architecto assumenda, consectetur culpa dicta, distinctio earum esse exercitationem
                        expedita fugiat id illum in inventore maiores minus odio perspiciatis placeat provident quae
                        quaerat quam rerum sunt tenetur unde voluptates! Ab, consequuntur, deleniti deserunt enim fugit
                        harum illum magni modi nam perferendis quidem saepe similique tempora vel.</p>
                </div>
                <div
                    className={`bg-black font-semibold py-20 text-white w-full flex flex-col items-center justify-center`}>
                    <div className={`flex flex-col items-center justify-center`}>
                        <h4 className={`mb-5 text-3xl`}>Ready to start your journey?</h4>
                        <Link to="/">
                            <button
                                className="bg-orange-400 text-xl mt-3 rounded-full px-6 py-3 relative cursor-pointer">
                                Book
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
export default About;