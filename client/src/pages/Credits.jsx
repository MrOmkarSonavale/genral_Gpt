import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Credit = () => {

    const [plans, setPlans] = useState([]);

    const [loading, setLoading] = useState(true);

    const { token, axios } = useAppContext();

    const fetchPlans = async () => {
        try {
            const { data } = await axios.get('/api/credit/plan', {
                headers: { Authorization: token }
            });

            if (data.success) setPlans(data.plans);
            else toast.error(data.message || "failed to fetch plan");

        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };


    const purchasePlan = async (planId) => {
        try {
            const { data } = await axios.post('/api/credit/purchase', { planId }, {
                headers: { Authorization: token }
            });

            if (data.success) {
                window.location.href = data.url;
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    if (loading) return <Loading />

    return (
        <div className="max-w-7xl h-screen overflow-y-scroll mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-3xl font-semibold text-center mb-10 xl:mt-30  dark:text-white text-gray-600 ">Credit Plans</h2>

            <div className="flex flex-wrap justify-center gap-8">
                {
                    plans.map((plan, index) => (
                        <div key={plan._id} className={`border border-gray-200 dark:border-purple-700 rounded-lg shadow p-6 min-w-[300px] flex flex-col ${plan._id === 'pro' ? 'bg-purple-50 dark:bg-purple-900' : 'bg-white dark:bg-trasparent'}`}>
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-purple-600 mb-2">{plan.name}</h3>

                                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-4">${plan.price}
                                    <span>{' '}/ {plan.credits} credits</span>
                                </p>

                                <ul>
                                    {
                                        plan.features.map((feature, idex) => {
                                            return <li key={idex} className={`${plan._id !== 'pro' ? "dark:text-purple-400" : ""}`}>{feature}</li>
                                        })
                                    }
                                </ul>

                            </div>

                            <button className="mt-6 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-medium py-2 rounded transition-colors cursor-pointer" onClick={() => toast.promise(purchasePlan(plan._id), { loading: 'Processing...' })}>Buy Now</button>
                        </div>
                    ))
                }

            </div>
        </div>)
};

export default Credit;