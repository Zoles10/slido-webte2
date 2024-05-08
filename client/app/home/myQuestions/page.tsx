

import React, { useEffect, useState } from 'react';
import { Table } from '@/components/ui/table';
import Logo from '@/components/logo';
import LogoutButton from '@/components/ui/logoutButton';
import { ModeToggle } from '@/components/mode-toggle';
import { Paragraph } from '@/components/ui/typography/typography';
import QuestionForm from '@/components/questions/question_form';
import QuestionTable from "@/components/ui/questionsTable";
import ToggleSwitch from '@/components/ui/toggleButton';


async function fetchQuestions() {

    const response = await fetch('https://node98.webte.fei.stuba.sk/slido-webte2/server/api/question');
    const data = await response.json();
    return data;

}

export default async function myQuestions() {
    const [data, setData] = useState([]);
    const [showSpecificUserQuestions, setShowSpecificUserQuestions] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const data = await fetchQuestions();
            setData(data);
        }
        fetchData();
    }, []);
    const specificUserId = 3;
    const questionsList = data.map((question: { question_string: any; topic: any; created_at: any; user_id: any; question_id: any; code:any; }) => ({
        question: question.question_string,
        topic: question.topic,
        created_at: question.created_at,
        user: question.user_id,
        id: question.question_id,
        code : question.code,
    }));
    const questionsListWithSpecificUser = questionsList.filter((question: { user: any; }) => question.user === specificUserId);

    const toggleQuestions = (checked: boolean | ((prevState: boolean) => boolean)) => {
        setShowSpecificUserQuestions(checked);
    };

    return (

        <>
            <header className="flex justify-between items-center w-full p-2">
                <Logo />
                <div className="flex space-x-4">
                    <LogoutButton />
                    <ModeToggle />
                </div>
            </header>
            <main className="flex min-h-screen flex-col items-center justify-center p-24 ">
                <div className="w-full max-w-2xl p-8 shadow-lg rounded-lg">
                    <ToggleSwitch />
                    <h1 className="text-2xl font-bold text-center">
                        My questions
                    </h1>
                    <QuestionTable questions={showSpecificUserQuestions ? questionsListWithSpecificUser : questionsList} />


                </div>
            </main>
        </>
    )
}