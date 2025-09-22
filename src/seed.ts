import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Quiz from './models/Quiz';
import Question from './models/Question';
import User from './models/User';
import Answer from './models/Answer';

dotenv.config();

const quizzes = [
    {
        title: "Genel Kültür Testi",
        description: "Dünya ve Türkiye hakkında genel kültür soruları.",
        questions: [
            {
                text: "Türkiye'nin başkenti neresidir?",
                answerOptions: [
                    { id: 1, text: "İstanbul" },
                    { id: 2, text: "Ankara" },
                    { id: 3, text: "İzmir" },
                ],
                numSelections: 1,
                isSkippingAllowed: false,
            },
            {
                text: "Aşağıdaki hayvanlardan hangisi memeli değildir?",
                answerOptions: [
                    { id: 1, text: "Yunus" },
                    { id: 2, text: "Penguen" },
                    { id: 3, text: "Yarasa" },
                ],
                numSelections: 1,
                isSkippingAllowed: true,
            },
        ],
    },
    {
        title: "Yazılım Geliştirme Temelleri",
        description: "Yazılım dünyasından temel bilgiler.",
        questions: [
            {
                text: "Bir mobil uygulama geliştirmek için kullanabileceğiniz cross-platform teknolojiler hangileridir?",
                answerOptions: [
                    { id: 1, text: "Flutter" },
                    { id: 2, text: "React Native" },
                    { id: 3, text: "Android Studio" },
                ],
                numSelections: 2,
                isSkippingAllowed: false,
            },
            {
                text: "Frontend ve Backend terimlerini açıklayan en iyi seçenek hangisidir?",
                answerOptions: [
                    { id: 1, text: "Backend kullanıcı arayüzü, Frontend sunucu tarafı mantığıdır." },
                    { id: 2, text: "Frontend kullanıcı arayüzü, Backend sunucu tarafı mantığıdır." },
                ],
                numSelections: 1,
                isSkippingAllowed: false,
            },
        ],
    },
];

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('Database connection successful.');

        // Tüm eski verileri temizle
        await User.deleteMany({});
        await Quiz.deleteMany({});
        await Question.deleteMany({});
        await Answer.deleteMany({});

        console.log('Old data was cleared.');

        for (const quizData of quizzes) {
            const savedQuestions = [];
            for (const q of quizData.questions) {
                const newQuestion = new Question(q);
                await newQuestion.save();
                savedQuestions.push(newQuestion._id);
            }

            const newQuiz = new Quiz({
                title: quizData.title,
                description: quizData.description,
                questions: savedQuestions,
            });
            await newQuiz.save();
        }

        console.log('Mock data added successfully!');
    } catch (error) {
        console.error('An error occurred while adding data:', error);
    } finally {
        await mongoose.disconnect();
    }
}

seedDatabase();