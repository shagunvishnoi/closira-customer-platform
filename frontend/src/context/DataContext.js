import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { enquiries as initialEnquiries } from "../mock/enquiries";
import { followUps as initialFollowUps } from "../mock/followUps";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [enquiries, setEnquiries] = useState([]);
    const [followUps, setFollowUps] = useState([]);
    const [resolvedIds, setResolvedIds] = useState([]);
    const [doneFollowUpIds, setDoneFollowUpIds] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const savedEnquiries = await AsyncStorage.getItem("custom_enquiries");
                const savedResolved = await AsyncStorage.getItem("resolved_escalations");
                const savedDoneFU = await AsyncStorage.getItem("done_followups");

                const localEnquiries = savedEnquiries ? JSON.parse(savedEnquiries) : [];
                setEnquiries([...initialEnquiries, ...localEnquiries]);

                if (savedResolved) setResolvedIds(JSON.parse(savedResolved));
                if (savedDoneFU) setDoneFollowUpIds(JSON.parse(savedDoneFU));

                setFollowUps(initialFollowUps);
                setIsLoaded(true);
            } catch (e) {
                console.error("Failed to load global data", e);
                setEnquiries(initialEnquiries);
                setFollowUps(initialFollowUps);
                setIsLoaded(true);
            }
        };
        loadData();
    }, []);

    const addEnquiry = async (newEnq) => {
        const updated = [newEnq, ...enquiries];
        setEnquiries(updated);

        // Persist only custom ones or the whole list? Let's persist the whole list for simplicity in this demo
        const customOnly = updated.filter(e => e.id.startsWith("custom_"));
        await AsyncStorage.setItem("custom_enquiries", JSON.stringify(customOnly));
    };

    const resolveEscalation = async (id) => {
        const updated = [...resolvedIds, id];
        setResolvedIds(updated);
        await AsyncStorage.setItem("resolved_escalations", JSON.stringify(updated));
    };

    const markFollowUpDone = async (id) => {
        const updated = [...doneFollowUpIds, id];
        setDoneFollowUpIds(updated);
        await AsyncStorage.setItem("done_followups", JSON.stringify(updated));
    };

    return (
        <DataContext.Provider value={{
            enquiries,
            followUps,
            resolvedIds,
            doneFollowUpIds,
            isLoaded,
            addEnquiry,
            resolveEscalation,
            markFollowUpDone
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
