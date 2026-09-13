import React from "react";

function Programs() {
    return (
        <section className="bg-[#F7F3EB] py-24 px-16">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-6xl font-bold text-[#2166D1] text-center mb-20">
                    Program Terms
                </h2>

                <div className="grid grid-cols-2 gap-x-20 gap-y-10">
                    <p className="text-[23px] leading-[1.4] text-gray-800">
                        Participating startups retain full intellectual
                        property ownership, as NigComSat makes
                        no IP claims.
                    </p>

                    <p className="text-[23px] leading-[1.4] text-gray-800">
                        While participation is entirely free—
                        with NigComSat covering all training,
                        mentorship, and event costs—
                   </p>

                   <p className="text-[23px] leading-[1.4] text-gray-800">
                        Selected startups must fully commit
                        to the program schedule.
                   </p>

                   <p className="text-[23px] leading-[1.4] text-gray-800">
                        Additionally, NigComSat reserves the
                        right to verify all submitted
                        application information.
                   </p>

                </div>

            </div>

        </section>
    );
}

export default Programs