import React, { useState, useEffect } from 'react';
import { Calendar, Trophy, Save, Award, Edit3, Target, Bike, Coffee, ShoppingBag, Utensils, Smartphone, CreditCard, Gift, Book, Home, Leaf, Gamepad2, Brain, Coins, Puzzle, Lightbulb, PiggyBank, BarChart3, CheckCircle2, Trash2, TrendingUp, XCircle, Wallet, Scale, FileText, Clock } from 'lucide-react';

interface DayNote {
  date: string;
  content: string;
}

interface Challenge {
  id: string;
  icon: React.ReactNode;
  title: string;
  points: number;
  description: string;
}

interface MiniGame {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  maxPoints: number;
  isPlaying: boolean;
  component: React.ReactNode;
}

interface CalendarEvent {
    id: string;
    date: string;
    title: string;
    description: string;
}

function App() {
  const [currentNote, setCurrentNote] = useState('');
  const [notes, setNotes] = useState<DayNote[]>(() => {
    try {
      const storedNotes = localStorage.getItem('notes');
      const initialNotes = storedNotes ? JSON.parse(storedNotes) : [];
      console.log("Loaded notes:", initialNotes); // Debugging
      return initialNotes;
    } catch (error) {
      console.error("Failed to load notes from localStorage:", error);
      return [];
    }
  });
  const [points, setPoints] = useState<number>(() => {
    try {
      const storedPoints = localStorage.getItem('points');
      const initialPoints = storedPoints ? parseInt(storedPoints, 10) : 0;
      console.log("Loaded points:", initialPoints); // Debugging
      return initialPoints;
    } catch (error) {
      console.error("Failed to load points from localStorage:", error);
      return 0;
    }
  });
  const [completedDays, setCompletedDays] = useState<string[]>(() => {
    try {
      const storedCompletedDays = localStorage.getItem('completedDays');
      const initialCompletedDays = storedCompletedDays ? JSON.parse(storedCompletedDays) : [];
      console.log("Loaded completedDays:", initialCompletedDays); // Debugging
      return initialCompletedDays;
    } catch (error) {
      console.error("Failed to load completedDays from localStorage:", error);
      return [];
    }
  });
  const [completedChallenges, setCompletedChallenges] = useState<string[]>(() => {
    try {
      const storedCompletedChallenges = localStorage.getItem('completedChallenges');
      const initialCompletedChallenges = storedCompletedChallenges ? JSON.parse(storedCompletedChallenges) : [];
      console.log("Loaded completedChallenges:", initialCompletedChallenges); // Debugging
      return initialCompletedChallenges;
    } catch (error) {
      console.error("Failed to load completedChallenges from localStorage:", error);
      return [];
    }
  });
  const [selectedGame, setSelectedGame] = useState<string | null>(() => {
    try {
      const storedSelectedGame = localStorage.getItem('selectedGame');
      const initialSelectedGame = storedSelectedGame ? storedSelectedGame : null;
      console.log("Loaded selectedGame:", initialSelectedGame); // Debugging
      return initialSelectedGame;
    } catch (error) {
      console.error("Failed to load selectedGame from localStorage:", error);
      return null;
    }
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [puzzlePieces, setPuzzlePieces] = useState(Array.from({ length: 9 }, (_, i) => i));
  const [isPuzzleSolved, setIsPuzzleSolved] = useState(false);
  const [budgetItems, setBudgetItems] = useState<any[]>(() => {
    try {
      const storedBudgetItems = localStorage.getItem('budgetItems');
      const initialBudgetItems = storedBudgetItems ? JSON.parse(storedBudgetItems) : [
        { id: 'rent', name: 'Loyer', cost: 500, type: 'expense' },
        { id: 'salary', name: 'Salaire', cost: 1500, type: 'income' },
        { id: 'food', name: 'Nourriture', cost: 300, type: 'expense' },
        { id: 'savings', name: 'Épargne', cost: 200, type: 'income' },
      ];
      console.log("Loaded budgetItems:", initialBudgetItems); // Debugging
      return initialBudgetItems;
    } catch (error) {
      console.error("Failed to load budgetItems from localStorage:", error);
      return [
        { id: 'rent', name: 'Loyer', cost: 500, type: 'expense' },
        { id: 'salary', name: 'Salaire', cost: 1500, type: 'expense' },
        { id: 'food', name: 'Nourriture', cost: 300, type: 'expense' },
        { id: 'savings', name: 'Épargne', cost: 200, type: 'income' },
      ];
    }
  });
  const [newBudgetName, setNewBudgetName] = useState('');
  const [newBudgetValue, setNewBudgetValue] = useState('');
  const [newBudgetType, setNewBudgetType] = useState('expense');
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
    const [noSpendDayCompleted, setNoSpendDayCompleted] = useState<boolean>(() => {
        try {
            const storedNoSpendDay = localStorage.getItem('noSpendDayCompleted');
            return storedNoSpendDay ? JSON.parse(storedNoSpendDay) : false;
        } catch (error) {
            console.error("Failed to load noSpendDayCompleted from localStorage:", error);
            return false;
        }
    });
    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
        try {
            const storedCalendarEvents = localStorage.getItem('calendarEvents');
            return storedCalendarEvents ? JSON.parse(storedCalendarEvents) : [];
        } catch (error) {
            console.error("Failed to load calendarEvents from localStorage:", error);
            return [];
        }
    });
    const [newCalendarEvent, setNewCalendarEvent] = useState<CalendarEvent>({
        id: '',
        date: selectedDate,
        title: '',
        description: '',
    });
    const [savingsGoal, setSavingsGoal] = useState<number>(() => {
        try {
            const storedSavingsGoal = localStorage.getItem('savingsGoal');
            return storedSavingsGoal ? parseInt(storedSavingsGoal, 10) : 1000;
        } catch (error) {
            console.error("Failed to load savingsGoal from localStorage:", error);
            return 1000;
        }
    });
    const [currentSavings, setCurrentSavings] = useState<number>(() => {
        try {
            const storedCurrentSavings = localStorage.getItem('currentSavings');
            return storedCurrentSavings ? parseInt(storedCurrentSavings, 10) : 0;
        } catch (error) {
            console.error("Failed to load currentSavings from localStorage:", error);
            return 0;
        }
    });
    const [guessNumber, setGuessNumber] = useState('');
    const [randomNumber, setRandomNumber] = useState(Math.floor(Math.random() * 100) + 1);
    const [guessMessage, setGuessMessage] = useState('');
    const [isNumberGuessed, setIsNumberGuessed] = useState(false);
    const [debtAmount, setDebtAmount] = useState<number>(() => {
        try {
            const storedDebtAmount = localStorage.getItem('debtAmount');
            return storedDebtAmount ? parseInt(storedDebtAmount, 10) : 5000;
        } catch (error) {
            console.error("Failed to load debtAmount from localStorage:", error);
            return 5000;
        }
    });
    const [paymentAmount, setPaymentAmount] = useState('');
    const [debtMessage, setDebtMessage] = useState('');
    const [isDebtFree, setIsDebtFree] = useState(false);
    const [billReminderTitle, setBillReminderTitle] = useState('');
    const [billReminderDate, setBillReminderDate] = useState(selectedDate);
    const [billReminders, setBillReminders] = useState<CalendarEvent[]>(() => {
        try {
            const storedBillReminders = localStorage.getItem('billReminders');
            return storedBillReminders ? JSON.parse(storedBillReminders) : [];
        } catch (error) {
            console.error("Failed to load billReminders from localStorage:", error);
            return [];
        }
    });
    const [isTimeManagementGameActive, setIsTimeManagementGameActive] = useState(false);
    const [tasksCompleted, setTasksCompleted] = useState(0);
    const [timeManagementMessage, setTimeManagementMessage] = useState('');

  const challenges: Challenge[] = [
    {
      id: 'transport',
      icon: <Bike className="text-green-500" size={24} aria-hidden="true" />,
      title: 'Transport Écologique',
      points: 15,
      description: 'Utilisez les transports en commun ou le vélo'
    },
    {
      id: 'coffee',
      icon: <Coffee className="text-amber-700" size={24} aria-hidden="true" />,
      title: 'Pause Café Maison',
      points: 10,
      description: 'Préparez votre café à la maison'
    },
    {
      id: 'shopping',
      icon: <ShoppingBag className="text-purple-500" size={24} aria-hidden="true" />,
      title: 'Jour Sans Shopping',
      points: 20,
      description: 'Évitez les achats non essentiels'
    },
    {
      id: 'food',
      icon: <Utensils className="text-orange-500" size={24} aria-hidden="true" />,
      title: 'Repas Fait Maison',
      points: 15,
      description: 'Cuisinez tous vos repas'
    },
    {
      id: 'digital',
      icon: <Smartphone className="text-blue-500" size={24} aria-hidden="true" />,
      title: 'Détox Numérique',
      points: 25,
      description: 'Pas d\'achats en ligne aujourd\'hui'
    },
    {
      id: 'cash',
      icon: <CreditCard className="text-emerald-500" size={24} aria-hidden="true" />,
      title: 'Journée Cash',
      points: 20,
      description: 'Utilisez uniquement de l\'argent liquide'
    },
    {
      id: 'gift',
      icon: <Gift className="text-red-500" size={24} aria-hidden="true" />,
      title: 'Cadeau DIY',
      points: 30,
      description: 'Créez un cadeau fait maison'
    },
    {
      id: 'learning',
      icon: <Book className="text-indigo-500" size={24} aria-hidden="true" />,
      title: 'Apprentissage Gratuit',
      points: 15,
      description: 'Utilisez des ressources gratuites'
    },
    {
      id: 'energy',
      icon: <Home className="text-yellow-600" size={24} aria-hidden="true" />,
      title: 'Économie d\'Énergie',
      points: 20,
      description: 'Réduisez votre consommation'
    },
    {
      id: 'eco',
      icon: <Leaf className="text-green-600" size={24} aria-hidden="true" />,
      title: 'Zéro Déchet',
      points: 25,
      description: 'Aucun achat emballé'
    }
  ];

  const quizQuestions = [
    {
      question: "Quelle est la meilleure façon d'économiser sur le café ?",
      options: [
        "Acheter un café tous les jours",
        "Préparer son café à la maison",
        "Boire du café au bureau",
        "Ne pas boire de café"
      ],
      correct: 1
    },
    {
      question: "Comment réduire ses dépenses alimentaires ?",
      options: [
        "Commander des repas",
        "Manger au restaurant",
        "Préparer ses repas en avance",
        "Sauter des repas"
      ],
      correct: 2
    },
    {
      question: "Quelle est la règle des 50/30/20 ?",
      options: [
        "50% loisirs, 30% épargne, 20% besoins",
        "50% besoins, 30% envies, 20% épargne",
        "50% épargne, 30% besoins, 20% envies",
        "50% envies, 30% besoins, 20% épargne"
      ],
      correct: 1
    }
  ];

  const handleQuizAnswer = (answerIndex: number) => {
    if (answerIndex === quizQuestions[currentQuestion].correct) {
      setPoints(points + 5);
      setQuizScore(quizScore + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
    
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setSelectedGame(null);
      setCurrentQuestion(0);
    }
  };

  const shufflePuzzle = () => {
    let shuffled = [...puzzlePieces].sort(() => Math.random() - 0.5);
    setPuzzlePieces(shuffled);
    setIsPuzzleSolved(false);
  };

  const swapPieces = (index1: number, index2: number) => {
    const newPieces = [...puzzlePieces];
    [newPieces[index1], newPieces[index2]] = [newPieces[index2], newPieces[index1]];
    setPuzzlePieces(newPieces);
  };

  const checkPuzzleSolved = () => {
    const solved = puzzlePieces.every((piece, index) => piece === index);
    if (solved) {
      setIsPuzzleSolved(true);
      setPoints(points + 20);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      setSelectedGame(null);
    }
  };

  useEffect(() => {
    if (selectedGame === 'puzzle') {
      shufflePuzzle();
    }
  }, [selectedGame]);

  useEffect(() => {
    if (isPuzzleSolved) {
      setSelectedGame(null);
    }
  }, [isPuzzleSolved]);

  const handleAddBudgetItem = () => {
    if (newBudgetName && newBudgetValue) {
      const newItem = {
        id: Math.random().toString(36).substring(7),
        name: newBudgetName,
        cost: parseFloat(newBudgetValue),
        type: newBudgetType,
      };
      setBudgetItems([...budgetItems, newItem]);
      setNewBudgetName('');
      setNewBudgetValue('');
      setPoints(points + 10);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  const calculateTotal = (type: string) => {
    return budgetItems.filter(item => item.type === type).reduce((acc, item) => acc + item.cost, 0);
  };

    const handleAddCalendarEvent = () => {
        if (newCalendarEvent.title && newCalendarEvent.date) {
            const newEvent = {
                id: Math.random().toString(36).substring(7),
                date: newCalendarEvent.date,
                title: newCalendarEvent.title,
                description: newCalendarEvent.description,
            };
            setCalendarEvents([...calendarEvents, newEvent]);
            setNewCalendarEvent({ id: '', date: selectedDate, title: '', description: '' });
            setPoints(points + 5);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 2000);
        }
    };

    const handleDeleteCalendarEvent = (id: string) => {
        setCalendarEvents(calendarEvents.filter(event => event.id !== id));
    };

    const handleSavingsUpdate = () => {
        const savingsToAdd = Math.floor(Math.random() * 50) + 10;
        setCurrentSavings(currentSavings + savingsToAdd);
        setPoints(points + 10);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
    };

    const handleGuessSubmit = () => {
        const userGuess = parseInt(guessNumber, 10);
        if (isNaN(userGuess)) {
            setGuessMessage('Veuillez entrer un nombre valide.');
            return;
        }

        if (userGuess === randomNumber) {
            setGuessMessage(`Félicitations ! Vous avez deviné le nombre ${randomNumber}.`);
            setPoints(points + 30);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 2000);
            setIsNumberGuessed(true);
        } else if (userGuess < randomNumber) {
            setGuessMessage('Trop bas ! Essayez encore.');
        } else {
            setGuessMessage('Trop haut ! Essayez encore.');
        }
    };

    useEffect(() => {
        if (isNumberGuessed) {
            const newRandomNumber = Math.floor(Math.random() * 100) + 1;
            setRandomNumber(newRandomNumber);
            setIsNumberGuessed(false);
            setGuessNumber('');
            setGuessMessage('');
        }
    }, [isNumberGuessed]);

    useEffect(() => {
        try {
            console.log("Saving savingsGoal:", savingsGoal);
            localStorage.setItem('savingsGoal', savingsGoal.toString());
        } catch (error) {
            console.error("Failed to save savingsGoal to localStorage:", error);
        }
    }, [savingsGoal]);

    useEffect(() => {
        try {
            console.log("Saving currentSavings:", currentSavings);
            localStorage.setItem('currentSavings', currentSavings.toString());
        } catch (error) {
            console.error("Failed to save currentSavings to localStorage:", error);
        }
    }, [currentSavings]);

    useEffect(() => {
        try {
            console.log("Saving debtAmount:", debtAmount);
            localStorage.setItem('debtAmount', debtAmount.toString());
        } catch (error) {
            console.error("Failed to save debtAmount to localStorage:", error);
        }
    }, [debtAmount]);

    useEffect(() => {
        try {
            console.log("Saving billReminders:", billReminders);
            localStorage.setItem('billReminders', JSON.stringify(billReminders));
        } catch (error) {
            console.error("Failed to save billReminders to localStorage:", error);
        }
    }, [billReminders]);

    const handleDebtPayment = () => {
        const payment = parseFloat(paymentAmount);
        if (isNaN(payment) || payment <= 0) {
            setDebtMessage('Veuillez entrer un montant valide.');
            return;
        }

        if (payment > debtAmount) {
            setDebtMessage('Le paiement ne peut pas être supérieur au montant de la dette.');
            return;
        }

        setDebtAmount(debtAmount - payment);
        setPaymentAmount('');
        setDebtMessage(`Paiement de ${payment} € effectué.`);
        setPoints(points + 15);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);

        if (debtAmount - payment === 0) {
            setIsDebtFree(true);
            setDebtMessage('Félicitations ! Vous avez remboursé toute votre dette.');
        }
    };

    const handleAddBillReminder = () => {
        if (billReminderTitle && billReminderDate) {
            const newReminder = {
                id: Math.random().toString(36).substring(7),
                date: billReminderDate,
                title: billReminderTitle,
                description: `Paiement de la facture ${billReminderTitle} à effectuer.`,
            };
            setBillReminders([...billReminders, newReminder]);
            setBillReminderTitle('');
            setBillReminderDate(selectedDate);
            setPoints(points + 5);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 2000);
        }
    };

    const handleStartStopGame = () => {
        setIsTimeManagementGameActive(!isTimeManagementGameActive);
        setTasksCompleted(0);
        setTimeManagementMessage('');
    };

    const handleTaskCompletion = () => {
        if (isTimeManagementGameActive) {
            setTasksCompleted(tasksCompleted + 1);
            if (tasksCompleted >= 4) {
                setTimeManagementMessage('Félicitations ! Vous avez terminé toutes les tâches.');
                setPoints(points + 20);
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 2000);
                setIsTimeManagementGameActive(false);
            }
        }
    };

    useEffect(() => {
        if (tasksCompleted >= 5) {
            setIsTimeManagementGameActive(false);
        }
    }, [tasksCompleted]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value);
        setNewCalendarEvent(prevState => ({ ...prevState, date: e.target.value }));
    };

  const miniGames = [
    {
      id: 'quiz',
      icon: <Brain className="text-purple-500" size={24} aria-hidden="true" />,
      title: 'Quiz Finance',
      description: 'Testez vos connaissances financières',
      maxPoints: 15,
      isPlaying: selectedGame === 'quiz',
      component: (
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4">{quizQuestions[currentQuestion].question}</h3>
          <div className="space-y-3">
            {quizQuestions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleQuizAnswer(index)}
                className="w-full p-3 text-left rounded-lg bg-gray-50 hover:bg-purple-50 transition-colors"
                aria-label={`Réponse ${index + 1}: ${option}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'puzzle',
      icon: <Puzzle className="text-orange-500" size={24} aria-hidden="true" />,
      title: 'Puzzle Épargne',
      description: 'Reconstituez votre tirelire',
      maxPoints: 25,
      isPlaying: selectedGame === 'puzzle',
      component: (
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4">Reconstituez l'image !</h3>
          <div className="grid grid-cols-3 gap-2">
            {puzzlePieces.map((piece, index) => (
              <button
                key={index}
                onClick={() => swapPieces(index, puzzlePieces.indexOf(0))}
                disabled={piece === 0}
                className={`w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center text-xl font-bold ${piece === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`}
                aria-label={`Pièce du puzzle ${index + 1}`}
              >
                {piece === 0 ? '' : piece + 1}
              </button>
            ))}
          </div>
          <button
            onClick={checkPuzzleSolved}
            className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            aria-label="Vérifier si le puzzle est résolu"
          >
            Vérifier
          </button>
          {isPuzzleSolved && <p className="mt-4 text-green-600 font-bold">Puzzle résolu !</p>}
        </div>
      )
    },
    {
      id: 'budget',
      icon: <BarChart3 className="text-blue-500" size={24} aria-hidden="true" />,
      title: 'Gestion Budget',
      description: 'Ajoutez vos revenus et dépenses',
      maxPoints: 30,
      isPlaying: selectedGame === 'budget',
      component: (
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4">Gérez votre budget !</h3>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Nom de l'élément"
              value={newBudgetName}
              onChange={(e) => setNewBudgetName(e.target.value)}
              className="w-full p-2 border rounded mb-2"
              aria-label="Nom de l'élément budgétaire"
            />
            <input
              type="number"
              placeholder="Valeur"
              value={newBudgetValue}
              onChange={(e) => setNewBudgetValue(e.target.value)}
              className="w-full p-2 border rounded mb-2"
              aria-label="Valeur de l'élément budgétaire"
            />
            <select
              value={newBudgetType}
              onChange={(e) => setNewBudgetType(e.target.value)}
              className="w-full p-2 border rounded mb-2"
              aria-label="Type de l'élément budgétaire"
            >
              <option value="expense">Dépense</option>
              <option value="income">Revenu</option>
            </select>
            <button
              onClick={handleAddBudgetItem}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              aria-label="Ajouter un élément budgétaire"
            >
              Ajouter
            </button>
          </div>
          <div>
            <h4 className="text-lg font-semibold">Revenus</h4>
            <ul>
              {budgetItems.filter(item => item.type === 'income').map(item => (
                <li key={item.id} className="flex justify-between py-1">
                  <span>{item.name}</span>
                  <span>{item.cost} €</span>
                </li>
              ))}
            </ul>
            <h4 className="text-lg font-semibold mt-4">Dépenses</h4>
            <ul>
              {budgetItems.filter(item => item.type === 'expense').map(item => (
                <li key={item.id} className="flex justify-between py-1">
                  <span>{item.name}</span>
                  <span>{item.cost} €</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 font-bold">
              Total Revenus: {calculateTotal('income')} €
            </div>
            <div className="font-bold">
              Total Dépenses: {calculateTotal('expense')} €
            </div>
            <div className="font-bold">
              Solde: {calculateTotal('income') - calculateTotal('expense')} €
            </div>
          </div>
        </div>
      )
    },
        {
            id: 'savings',
            icon: <Wallet className="text-green-500" size={24} aria-hidden="true" />,
            title: 'Booster son épargne',
            description: 'Ajoutez aléatoirement un montant à votre épargne',
            maxPoints: 20,
            isPlaying: selectedGame === 'savings',
            component: (
                <div className="p-6 bg-white rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Booster son épargne</h3>
                    <p className="mb-4">Cliquez sur le bouton pour ajouter un montant aléatoire à votre épargne.</p>
                    <button
                        onClick={handleSavingsUpdate}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        aria-label="Ajouter à l'épargne"
                    >
                        Ajouter à l'épargne
                    </button>
                    <div className="mt-4">
                        <p>Objectif d'épargne: {savingsGoal} €</p>
                        <p>Épargne actuelle: {currentSavings} €</p>
                    </div>
                </div>
            )
        },
        {
            id: 'guessNumber',
            icon: <Lightbulb className="text-yellow-500" size={24} aria-hidden="true" />,
            title: 'Devinez le nombre',
            description: 'Devinez un nombre entre 1 et 100',
            maxPoints: 30,
            isPlaying: selectedGame === 'guessNumber',
            component: (
                <div className="p-6 bg-white rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Devinez le nombre entre 1 et 100</h3>
                    <input
                        type="number"
                        placeholder="Entrez votre nombre"
                        value={guessNumber}
                        onChange={(e) => setGuessNumber(e.target.value)}
                        className="w-full p-2 border rounded mb-2"
                        aria-label="Entrez votre nombre"
                    />
                    <button
                        onClick={handleGuessSubmit}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                        aria-label="Deviner"
                    >
                        Deviner
                    </button>
                    {guessMessage && <p className="mt-4">{guessMessage}</p>}
                </div>
            )
        },
        {
            id: 'debtManagement',
            icon: <CreditCard className="text-red-500" size={24} aria-hidden="true" />,
            title: 'Gestion des dettes',
            description: 'Effectuez des paiements sur votre dette',
            maxPoints: 40,
            isPlaying: selectedGame === 'debtManagement',
            component: (
                <div className="p-6 bg-white rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Gérez votre dette</h3>
                    <p className="mb-4">Montant de la dette: {debtAmount} €</p>
                    <input
                        type="number"
                        placeholder="Montant du paiement"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        className="w-full p-2 border rounded mb-2"
                        aria-label="Montant du paiement"
                    />
                    <button
                        onClick={handleDebtPayment}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        aria-label="Effectuer le paiement"
                    >
                        Effectuer le paiement
                    </button>
                    {debtMessage && <p className="mt-4">{debtMessage}</p>}
                    {isDebtFree && <p className="mt-4 text-green-600 font-bold">Vous êtes libre de dettes !</p>}
                </div>
            )
        },
        {
            id:'billReminder',
            icon: <Clock className="text-indigo-500" size={24} aria-hidden="true" />,
            title: 'Rappel de facture',
            description: 'Ajoutez un rappel pour vos factures',
            maxPoints: 25,
            isPlaying: selectedGame === 'billReminder',
            component: (
                <div className="p-6 bg-white rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Ajouter un rappel de facture</h3>
                    <input
                        type="text"
                        placeholder="Nom de la facture"
                        value={billReminderTitle}
                        onChange={(e) => setBillReminderTitle(e.target.value)}
                        className="w-full p-2 border rounded mb-2"
                        aria-label="Nom de la facture"
                    />
                    <input
                        type="date"
                        value={billReminderDate}
                        onChange={(e) => setBillReminderDate(e.target.value)}
                        className="w-full p-2 border rounded mb-2"
                        aria-label="Date de la facture"
                    />
                    <button
                        onClick={handleAddBillReminder}
                        className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                        aria-label="Ajouter un rappel de facture"
                    >
                        Ajouter un rappel
                    </button>
                    <h4 className="text-lg font-semibold mt-4">Rappels de factures</h4>
                    <ul>
                        {billReminders.map(reminder =>(
                            <li key={reminder.id} className="flex justify-between py-1 items-center">
                                <span>{reminder.title} - {new Date(reminder.date).toLocaleDateString('fr-FR')}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )
        },
        {
            id: 'timeManagement',
            icon: <Scale className="text-teal-500" size={24} aria-hidden="true" />,
            title: 'Gestion du temps',
            description: 'Terminez des tâches dans un temps limité',
            maxPoints: 35,
            isPlaying: selectedGame === 'timeManagement',
            component: (
                <div className="p-6 bg-white rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Gestion du temps</h3>
                    {!isTimeManagementGameActive ? (
                        <button
                            onClick={handleStartStopGame}
                            className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
                            aria-label="Démarrer le jeu"
                        >
                            Démarrer le jeu
                        </button>
                    ) : (
                        <div>
                            <p className="mb-4">Tâches à accomplir: {tasksCompleted} / 5</p>
                            <button
                                onClick={handleTaskCompletion}
                                className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
                                aria-label="Terminer une tâche"
                            >
                                Terminer une tâche
                            </button>
                            {timeManagementMessage && <p className="mt-4">{timeManagementMessage}</p>}
                        </div>
                    )}
                </div>
            )
        },
        {
            id: 'documentReview',
            icon: <FileText className="text-gray-500" size={24} aria-hidden="true" />,
            title: 'Revue de documents',
            description: 'Examinez des documents financiers',
            maxPoints: 30,
            isPlaying: selectedGame === 'documentReview',
            component: (
                <div className="p-6 bg-white rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Revue de documents financiers</h3>
                    <p className="mb-4">Examinez les documents suivants et répondez aux questions.</p>
                    <p>Document 1: Relevé bancaire</p>
                    <p>Document 2: Facture de carte de crédit</p>
                    <p>Document 3: Budget mensuel</p>
                    <button
                        onClick={() => {
                            setPoints(points + 30);
                            setShowConfetti(true);
                            setTimeout(() => setShowConfetti(false), 2000);
                            setSelectedGame(null);
                        }}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4"
                        aria-label="Examiner les documents"
                    >
                        Examiner les documents
                    </button>
                </div>
            )
        }
  ];

  // Obtenir le premier jour du mois
  const getFirstDayOfMonth = () => {
    const date = new Date(2025, 1, 1); // Février 2025
    let day = date.getDay();
    return day === 0 ? 6 : day - 1; // Ajuster pour commencer par lundi
  };

  const days = Array.from({ length: 28 }, (_, i) => i + 1);
  const currentDay = new Date().getDate();
  const weekDays = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];
  const firstDay = getFirstDayOfMonth();
  const progress = (completedDays.length / days.length) * 100;

  const toggleDay = (day: number) => {
    const dateStr = `2025-02-${day.toString().padStart(2, '0')}`;
    if (completedDays.includes(dateStr)) {
      setCompletedDays(completedDays.filter(d => d !== dateStr));
      setPoints(points - 10);
    } else {
      setCompletedDays([...completedDays, dateStr]);
      setPoints(points + 10);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  const toggleChallenge = (challengeId: string, challengePoints: number) => {
    if (completedChallenges.includes(challengeId)) {
      setCompletedChallenges(completedChallenges.filter(id => id !== challengeId));
      setPoints(points - challengePoints);
    } else {
      setCompletedChallenges([...completedChallenges, challengeId]);
      setPoints(points + challengePoints);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  const saveNote = () => {
    if (currentNote.trim()) {
      const newNote = {
        date: new Date().toISOString(),
        content: currentNote
      };
      setNotes([newNote, ...notes]);
      setCurrentNote('');
      setPoints(points + 5);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

    const clearNotes = () => {
        setNotes([]);
    };

    const clearPoints = () => {
        setPoints(0);
    };

    useEffect(() => {
        const today = new Date();
        if (today.getDate() === 1) {
            // setPoints(0); // Removed to prevent points from resetting every time the component mounts
        }
    }, []);

  useEffect(() => {
    try {
      console.log("Saving notes:", notes); // Debugging
      localStorage.setItem('notes', JSON.stringify(notes));
    } catch (error) {
      console.error("Failed to save notes to localStorage:", error);
    }
  }, [notes]);

  useEffect(() => {
    try {
      console.log("Saving points:", points); // Debugging
      localStorage.setItem('points', points.toString());
    } catch (error) {
      console.error("Failed to save points to localStorage:", error);
    }
  }, [points]);

  useEffect(() => {
    try {
      console.log("Saving completedDays:", completedDays); // Debugging
      localStorage.setItem('completedDays', JSON.stringify(completedDays));
    } catch (error) {
      console.error("Failed to save completedDays to localStorage:", error);
    }
  }, [completedDays]);

  useEffect(() => {
    try {
      console.log("Saving completedChallenges:", completedChallenges); // Debugging
      localStorage.setItem('completedChallenges', JSON.stringify(completedChallenges));
    } catch (error) {
      console.error("Failed to save completedChallenges to localStorage:", error);
    }
  }, [completedChallenges]);

  useEffect(() => {
    try {
      console.log("Saving selectedGame:", selectedGame); // Debugging
      localStorage.setItem('selectedGame', selectedGame || '');
    } catch (error) {
      console.error("Failed to save selectedGame to localStorage:", error);
    }
  }, [selectedGame]);

  useEffect(() => {
    try {
      console.log("Saving budgetItems:", budgetItems); // Debugging
      localStorage.setItem('budgetItems', JSON.stringify(budgetItems));
    } catch (error) {
      console.error("Failed to save budgetItems to localStorage:", error);
    }
  }, [budgetItems]);

    useEffect(() => {
        try {
            console.log("Saving savingsGoal:", savingsGoal);
            localStorage.setItem('savingsGoal', savingsGoal.toString());
        } catch (error) {
            console.error("Failed to save savingsGoal to localStorage:", error);
        }
    }, [savingsGoal]);

    useEffect(() => {
        try {
            console.log("Saving currentSavings:", currentSavings);
            localStorage.setItem('currentSavings', currentSavings.toString());
        } catch (error) {
            console.error("Failed to save currentSavings to localStorage:", error);
        }
    }, [currentSavings]);

    useEffect(() => {
        try {
            console.log("Saving debtAmount:", debtAmount);
            localStorage.setItem('debtAmount', debtAmount.toString());
        } catch (error) {
            console.error("Failed to save debtAmount to localStorage:", error);
        }
    }, [debtAmount]);

    useEffect(() => {
        try {
            console.log("Saving billReminders:", billReminders);
            localStorage.setItem('billReminders', JSON.stringify(billReminders));
        } catch (error) {
            console.error("Failed to save billReminders to localStorage:", error);
        }
    }, [billReminders]);

    const handleNoSpendDayToggle = () => {
        setNoSpendDayCompleted(!noSpendDayCompleted);
        setPoints(noSpendDayCompleted ? points - 10 : points + 10);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pb-12">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-ping text-6xl">🎉</div>
          </div>
        </div>
      )}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2 animate-fade-in">Challenge Économies</h1>
          <p className="text-lg text-blue-700">Transformez vos habitudes financières, un jour à la fois !</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="relative animate-bounce">
              <Trophy className="text-yellow-500" size={40} aria-hidden="true" />
              <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {Math.floor(points / 100) + 1}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-purple-600">{points} points</span>
              <span className="text-sm text-purple-400">Niveau {Math.floor(points / 100) + 1}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="text-blue-600" size={24} aria-hidden="true" />
                  <h2 className="text-2xl font-semibold">Février 2025</h2>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Award className="text-green-500" size={20} aria-hidden="true" />
                  <span>{completedDays.length} jours sur 28</span>
                </div>
              </div>
                <div className="mb-4">
                    <div className="flex items-center justify-between">
                        <label htmlFor="noSpendDay" className="font-semibold text-gray-700">
                            Journée sans dépense
                        </label>
                        <button
                            id="noSpendDay"
                            onClick={handleNoSpendDayToggle}
                            className={`
                                px-4 py-2 rounded-lg text-sm font-medium transition-colors
                                ${noSpendDayCompleted
                                    ? 'bg-green-500 text-white hover:bg-green-700'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }
                            `}
                            aria-label="Marquer la journée sans dépense comme terminée"
                        >
                            {noSpendDayCompleted ? 'Terminé' : 'Non terminé'}
                        </button>
                    </div>
                    <div className="relative pt-1">
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                            <div
                                style={{ width: `${progress}%` }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-width duration-500"
                            ></div>
                        </div>
                    </div>
                </div>
              <div className="grid grid-cols-7 gap-3 mb-4">
                {weekDays.map(day => (
                  <div key={day} className="text-center font-medium text-gray-600 py-2">{day}</div>
                ))}
                {Array.from({ length: firstDay }).map((_, index) => (
                  <div key={`empty-${index}`} className="p-3" />
                ))}
                {days.map(day => (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`
                      p-3 rounded-lg text-center transition-all transform hover:scale-105
                      ${day === currentDay ? 'ring-2 ring-blue-400' : ''}
                      ${completedDays.includes(`2025-02-${day.toString().padStart(2, '0')}`)
                        ? 'bg-gradient-to-br from-green-400 to-green-500 text-white shadow-lg'
                        : 'hover:bg-gray-50 hover:shadow-md'}
                    `}
                    aria-label={`Marquer le jour ${day} comme ${completedDays.includes(`2025-02-${day.toString().padStart(2, '0')}`) ? 'non terminé' : 'terminé'}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <Target className="text-blue-600" size={24} aria-hidden="true" />
                <h2 className="text-2xl font-semibold">Défis du Jour</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {challenges.map(challenge => (
                  <button
                    key={challenge.id}
                                        onClick={() => toggleChallenge(challenge.id, challenge.points)}
                    className={`
                      p-4 rounded-xl transition-all transform hover:scale-105
                      ${completedChallenges.includes(challenge.id)
                        ? 'bg-gradient-to-br from-green-400 to-green-500 text-white'
                        : 'bg-gray-50 hover:shadow-md'}
                    `}
                    aria-label={`Marquer le défi ${challenge.title} comme ${completedChallenges.includes(challenge.id) ? 'non terminé' : 'terminé'}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {challenge.icon}
                      <span className="font-semibold">{challenge.title}</span>
                    </div>
                    <p className="text-sm opacity-90">{challenge.description}</p>
                    <div className="mt-2 text-sm font-medium">
                      +{challenge.points} points
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <Gamepad2 className="text-purple-600" size={24} aria-hidden="true" />
                <h2 className="text-2xl font-semibold">Mini-Jeux</h2>
              </div>
              {selectedGame ? (
                <div>
                  <button
                    onClick={() => setSelectedGame(null)}
                    className="mb-4 text-blue-600 hover:text-blue-800"
                  >
                    ← Retour aux jeux
                  </button>
                  {miniGames.find(game => game.id === selectedGame)?.component}
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {miniGames.map(game => (
                    <button
                      key={game.id}
                      onClick={() => setSelectedGame(game.id)}
                      className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all transform hover:scale-105"
                      aria-label={`Jouer au mini-jeu ${game.title}`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        {game.icon}
                        <span className="font-semibold">{game.title}</span>
                      </div>
                      <p className="text-sm text-gray-600">{game.description}</p>
                      <div className="mt-2 text-sm font-medium text-purple-600">
                        Jusqu'à +{game.maxPoints} points
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Edit3 className="text-blue-600" size={24} aria-hidden="true" />
                <h2 className="text-xl font-semibold">Journal du Jour {currentDay}</h2>
              </div>
              <textarea
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder="Notez vos réflexions et objectifs du jour..."
                className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                aria-label="Entrez votre note du jour"
              />
              <button
                onClick={saveNote}
                className="mt-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 flex items-center gap-2"
                aria-label="Sauvegarder la note"
              >
                <Save size={20} aria-hidden="true" />
                Sauvegarder la Note
              </button>
            </div>

            {notes.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Historique des Notes</h2>
                <div className="space-y-4">
                  {notes.map((note, index) => (
                    <div key={index} className="border-l-4 border-blue-400 pl-4 py-2">
                      <p className="text-sm text-gray-500">
                        {new Date(note.date).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-gray-700 mt-1">{note.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="text-green-600" size={24} aria-hidden="true" />
                    <h2 className="text-xl font-semibold">Événements du calendrier</h2>
                </div>
                <input
                    type="date"
                    value={newCalendarEvent.date}
                    onChange={(e) => setNewCalendarEvent({ ...newCalendarEvent, date: e.target.value })}
                    className="w-full p-2 border rounded mb-4"
                    aria-label="Sélectionner une date pour l'événement"
                />
                <input
                    type="text"
                    placeholder="Titre de l'événement"
                    value={newCalendarEvent.title}
                    onChange={(e) => setNewCalendarEvent({ ...newCalendarEvent, title: e.target.value })}
                    className="w-full p-2 border rounded mb-4"
                    aria-label="Titre de l'événement"
                />
                <textarea
                    placeholder="Description de l'événement"
                    value={newCalendarEvent.description}
                    onChange={(e) => setNewCalendarEvent({ ...newCalendarEvent, description: e.target.value })}
                    className="w-full p-2 border rounded mb-4"
                    aria-label="Description de l'événement"
                />
                <button
                    onClick={handleAddCalendarEvent}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    aria-label="Ajouter un événement au calendrier"
                >
                    Ajouter un événement
                </button>
                <h3 className="text-lg font-semibold mt-4">Événements du {new Date(selectedDate).toLocaleDateString('fr-FR')}</h3>
                <ul>
                    {calendarEvents
                        .filter(event => event.date === selectedDate)
                        .map(event => (
                            <li key={event.id} className="flex justify-between py-1 items-center">
                                <div>
                                    <span className="font-semibold">{event.title}</span>
                                    <p className="text-sm text-gray-500">{event.description}</p>
                                </div>
                                <button
                                    onClick={() => handleDeleteCalendarEvent(event.id)}
                                    className="text-red-500 hover:text-red-700"
                                    aria-label={`Supprimer l'événement ${event.title}`}
                                >
                                    <XCircle size={20} aria-hidden="true" />
                                </button>
                            </li>
                        ))}
                    </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="text-yellow-500" size={24} aria-hidden="true" />
                <h2 className="text-xl font-semibold mb-4">Conseil du Jour</h2>
              </div>
              <p className="text-gray-700">
                Établissez un budget hebdomadaire pour vos courses et essayez de cuisiner en lot pour économiser du temps et de l'argent.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Si cette application vous aide à économiser, considérez soutenir son développement.
          </p>
          <a 
            href="https://www.paypal.com/donate?hosted_button_id=9ZYERE3QBLG3U"
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-3 bg-[#0070BA] text-white px-8 py-3 rounded-lg hover:bg-[#003087] transition-all transform hover:scale-105 font-semibold"
          >
            <img 
              src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png" 
              alt="PayPal" 
              className="h-5" 
              aria-hidden="true"
            />
            Faire un don avec PayPal
          </a>
        </div>
        <div className="flex justify-center space-x-4 mt-4">
            <button
                onClick={clearNotes}
                className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
                aria-label="Effacer l'historique des notes"
            >
                <Trash2 className="inline-block mr-1" size={16} aria-hidden="true" />
                Effacer l'historique des notes
            </button>            <button
                onClick={clearPoints}
                className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
                aria-label="Réinitialiser les points"
            >
                <Trash2 className="inline-block mr-1" size={16} aria-hidden="true" />
                Réinitialiser les points
            </button>
        </div>
      </div>
    </div>
  );
}

export default App;
