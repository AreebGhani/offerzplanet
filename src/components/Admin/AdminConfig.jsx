import React, { useState, useEffect, useRef, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from '../../server';

const AdminConfig = () => {
    const navigate = useNavigate();
    const [host, setHost] = useState("");
    const [service, setService] = useState("");
    const [port, setPort] = useState("");
    const [password, setPassword] = useState("");
    const [mail, setMail] = useState("");
    const [api, setApi] = useState("");
    const [secret, setSecret] = useState("");
    const [update, setUpdate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const config = useMemo(() => ({ withCredentials: true }), []);

    const idRef = useRef(null);

    useEffect(() => {
        axios.get(
            `${server}/config/get-config`, config
        ).then(({ data }) => {
            setIsLoading(false);
            if (data.config?.length !== 0) {
                setUpdate(true);
                idRef.current = data.config[0]._id;
            }
            setHost(data.config[0].smtp[0].host);
            setService(data.config[0].smtp[0].service);
            setPort(data.config[0].smtp[0].port);
            setPassword(data.config[0].smtp[0].password);
            setMail(data.config[0].smtp[0].mail);
            setApi(data.config[0].stripe[0].api);
            setSecret(data.config[0].stripe[0].secret);
        }).catch((error) => {
            setIsLoading(false);
            toast.error(error.response.data.message);
        });
    }, [config]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const newForm = {
            host,
            service,
            port,
            password,
            mail,
            api,
            secret
        }

        if (update) {
            await axios.put(
                `${server}/config/update-config/${idRef.current}`,
                newForm,
                config
            ).then(({ data }) => {
                if (data.success) {
                    setLoading(false);
                    toast.success(data.message);
                    navigate("/admin-config");
                    window.location.reload();
                }
            }).catch((error) => {
                setLoading(false);
                toast.error(error.response.data.message);
            });
        } else {
            await axios.post(
                `${server}/config/create-config`,
                newForm,
                config
            ).then(({ data }) => {
                if (data.success) {
                    setLoading(false);
                    toast.success(data.message);
                    navigate("/admin-config");
                    window.location.reload();
                }
            }).catch((error) => {
                setLoading(false);
                toast.error(error.response.data.message);
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center w-full h-screen">
                <div className="rounded-full border-t-4 border-b-4 border-red-600 h-20 w-20 animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="w-[90%] m-10 800px:w-[90%] bg-white  shadow rounded-[4px] p-3 overflow-auto">
            <h5 className="text-[30px] font-Poppins text-center">Configuration</h5>
            <form onSubmit={handleSubmit}>
                <br /><br />
                <h5 className="text-[20px] font-Poppins">Email Service:</h5>
                <br />
                <div>
                    <label className="pb-2">
                        Host Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="host"
                        value={host}
                        className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        onChange={(e) => setHost(e.target.value)}
                        placeholder="Enter host name for email..."
                        required
                    />
                </div>
                <br />
                <div>
                    <label className="pb-2">
                        Service <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="service"
                        value={service}
                        className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        onChange={(e) => setService(e.target.value)}
                        placeholder="Enter service for email..."
                        required
                    />
                </div>
                <br />
                <div>
                    <label className="pb-2">
                        Port <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="port"
                        value={port}
                        className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        onChange={(e) => setPort(e.target.value)}
                        placeholder="Enter port number for email..."
                        required
                    />
                </div>
                <br />
                <div>
                    <label className="pb-2">
                        Password <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="password"
                        value={password}
                        className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password for email sevice..."
                        required
                    />
                </div>
                <br />
                <div>
                    <label className="pb-2">
                        Mail <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="mail"
                        value={mail}
                        className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        onChange={(e) => setMail(e.target.value)}
                        placeholder="Enter mail for email sevice..."
                        required
                    />
                </div>
                <br /><br />
                <h5 className="text-[20px] font-Poppins">Stripe Account:</h5>
                <br />
                <div>
                    <label className="pb-2">
                        API Key <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="api"
                        value={api}
                        className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        onChange={(e) => setApi(e.target.value)}
                        placeholder="Enter API Key for stripe..."
                        required
                    />
                </div>
                <br />
                <div>
                    <label className="pb-2">
                        Secret Key <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="secret"
                        value={secret}
                        className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        onChange={(e) => setSecret(e.target.value)}
                        placeholder="Enter Secret Key for stripe..."
                        required
                    />
                </div>
                <br /><br />
                <div>
                    <input
                        type="submit"
                        value={loading ? "Loading..." : `${update ? "Update" : "Add"} Configuration`}
                        className="mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
            </form>
            <br />
        </div>
    )
}

export default AdminConfig;