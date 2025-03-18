const quizData = {
    // Level 1: Beginner
    level1: [
      {
        question: "What do you do with a book?",
        options: ["eat it", "read it", "wear it", "drink it"],
        correctAnswer: 1
      },
      {
        question: "Choose the picture that shows 'happy':",
        options: ["😴", "😡", "😢", "😊"],
        correctAnswer: 3
      },
      {
        question: "Complete: 'I ___ to school every day.'",
        options: ["go", "goes", "going", "gone"],
        correctAnswer: 0
      },
      {
        question: "Which word does NOT belong?",
        options: ["orange", "banana", "cat", "apple"],
        correctAnswer: 2
      },
      {
        question: "What color is the sky on a clear day?",
        options: ["green", "red", "blue", "black"],
        correctAnswer: 2
      },
      {
        question: "Which is a pet animal?",
        options: ["elephant", "lion", "giraffe", "dog"],
        correctAnswer: 3
      },
      {
        question: "Which word means the opposite of 'hot'?",
        options: ["wet", "cold", "dry", "warm"],
        correctAnswer: 1
      },
      {
        question: "What do you use to write?",
        options: ["cup", "chair", "pen", "plate"],
        correctAnswer: 2
      }
    ],
    
    // Level 2: Elementary
    level2: [
      {
        question: "What would you most likely find in a kitchen?",
        options: ["bed", "shower", "desk", "refrigerator"],
        correctAnswer: 3
      },
      {
        question: "Choose the best word: 'She was ___ after running the marathon.'",
        options: ["hungry", "tired", "happy", "cold"],
        correctAnswer: 1
      },
      {
        question: "Which event happened in the past?",
        options: ["I am eating lunch", "I will eat dinner", "I ate breakfast", "I eat snacks"],
        correctAnswer: 2
      },
      {
        question: "What do people usually do at night?",
        options: ["exercise", "sleep", "work", "shop"],
        correctAnswer: 1
      },
      {
        question: "Which is NOT a season?",
        options: ["winter", "morning", "summer", "spring"],
        correctAnswer: 1
      },
      {
        question: "Complete the sentence: 'Please ___ the door when you leave.'",
        options: ["close", "open", "break", "paint"],
        correctAnswer: 0
      },
      {
        question: "Which sentence is correct?",
        options: ["She don't like coffee", "She doesn't likes coffee", "She doesn't like coffee", "She not like coffee"],
        correctAnswer: 2
      },
      {
        question: "Which word is the plural form of child?",
        options: ["childs", "childes", "childen", "children"],
        correctAnswer: 3
      }
    ],
    
    // Level 3: Intermediate
    level3: [
      {
        question: "From this conversation, how does Sarah feel about the movie? 'John: Did you enjoy the movie? Sarah: I nearly fell asleep during the first half hour.'",
        options: [ 
          "She was confused by it", 
          "She was bored by it", 
          "She loved it", 
          "She was scared by it"
        ],
        correctAnswer: 1
      },
      {
        question: "Which phrase best completes this sentence: 'Despite the heavy rain, ___.'",
        options: [
          "the weather was perfect", 
          "we decided to stay indoors", 
          "we still went hiking", 
          "we canceled the picnic"
        ],
        correctAnswer: 2
      },
      {
        question: "What does this sign mean: 'Wet Floor'?",
        options: [
          "The floor needs to be cleaned", 
          "Swimming is allowed here", 
          "You should pour water on the floor", 
          "You should be careful not to slip"
        ],
        correctAnswer: 3
      },
      {
        question: "Based on context, what does 'turn down' mean here: 'Please turn down the music'?",
        options: ["change the song", "make it quieter", "stop playing it", "play it faster"],
        correctAnswer: 1
      },
      {
        question: "What does 'running late' mean in this text message: 'Sorry, I'm running late. I'll be there in 15 minutes.'",
        options: [
          "arriving early", 
          "leaving now", 
          "behind schedule", 
          "exercising and will arrive later"
        ],
        correctAnswer: 2
      },
      {
        question: "Which response is most appropriate to 'How do you do?'",
        options: [
          "I'm doing well, thanks", 
          "I'm doing my homework", 
          "How do you do?", 
          "I do it carefully"
        ],
        correctAnswer: 2
      },
      {
        question: "What is the meaning of this sign: 'No Outside Food or Drink'?",
        options: [
          "You can only eat outside", 
          "You cannot bring food or drinks from elsewhere", 
          "Food and drinks are not allowed outside", 
          "You cannot take food or drinks outside"
        ],
        correctAnswer: 1
      },
      {
        question: "What does 'break a leg' mean when someone says it before a performance?",
        options: [
          "Be careful not to get injured", 
          "Dance energetically", 
          "Good luck", 
          "Try not to be nervous"
        ],
        correctAnswer: 2
      }
    ],
    
    // Level 4: Upper Intermediate
    level4: [
      {
        question: "What can you infer from this statement? 'The manager frowned as she read the quarterly report.'",
        options: [
          "The manager needed reading glasses", 
          "The manager was confused", 
          "The report contained good news", 
          "The report likely contained disappointing results"
        ],
        correctAnswer: 3
      },
      {
        question: "Which word best fits? 'After three days of negotiations, they finally reached a ___.'",
        options: ["compromise", "competition", "complication", "compound"],
        correctAnswer: 0
      },
      {
        question: "What does the idiom mean? 'It's not rocket science.'",
        options: [
          "It requires special training", 
          "It's related to space exploration", 
          "It's not difficult to understand", 
          "It's very complicated"
        ],
        correctAnswer: 2
      },
      {
        question: "Choose the most accurate interpretation: 'She has a tendency to exaggerate.'",
        options: [
          "She often makes things sound bigger or more extreme than they are", 
          "She avoids sharing her opinions", 
          "She is very precise with details", 
          "She likes to organize things carefully"
        ],
        correctAnswer: 0
      },
      {
        question: "What does this idiom suggest? 'He's burning the candle at both ends.'",
        options: [
          "He's trying to solve a problem in multiple ways", 
          "He's celebrating something important", 
          "He's saving money", 
          "He's exhausting himself by doing too much"
        ],
        correctAnswer: 3
      },
      {
        question: "Which is the most appropriate response to a colleague's presentation?",
        options: [
          "I disagree with everything you said", 
          "That wasn't as boring as I expected", 
          "Your presentation skills need improvement", 
          "You raised some interesting points worth considering"
        ],
        correctAnswer: 3
      },
      {
        question: "Which of these expressions means to be very busy?",
        options: [
          "To have a lot on your plate", 
          "To bite off more than you can chew", 
          "To have your cake and eat it too", 
          "To bring something to the table"
        ],
        correctAnswer: 0
      },
      {
        question: "What attitude does this response convey? 'Well, I suppose we could try your idea, but I doubt it will work.'",
        options: [
          "Enthusiasm", 
          "Skepticism", 
          "Confidence", 
          "Confusion"
        ],
        correctAnswer: 1
      }
    ],
    
    // Level 5: Advanced
    level5: [
        {
            question: "From this exchange, what is implied about the financial situation of the company? 'We need to implement immediate cost-cutting measures across all departments,' the CEO announced.",
            options: [ 
              "The company is planning to expand", 
              "The company is highly profitable", 
              "The company needs to reduce expenses", 
              "The company is hiring new employees"
            ],
            correctAnswer: 2
        },
      {
        question: "Which statement demonstrates irony?",
        options: [
          "The fire station burned down while the firefighters were away", 
          "The athlete trained daily and won the competition", 
          "The weather forecaster predicted rain and it rained", 
          "The student studied hard and received an excellent grade"
        ],
        correctAnswer: 0
      },
      {
        question: "What does 'pontificate' most closely mean in this context? 'He tends to pontificate on political matters despite his limited knowledge.'",
        options: [
          "ask thoughtful questions", 
          "express uncertainty", 
          "speak humbly", 
          "talk in a dogmatic or pompous way"
        ],
        correctAnswer: 3
      },
      {
        question: "What does this metaphor suggest? 'The news was a dagger to his heart.'",
        options: [
          "The news was quickly delivered", 
          "The news was extremely painful or devastating", 
          "The news was surprising", 
          "The news was hard to understand"
        ],
        correctAnswer: 1
      },
      {
        question: "What is the author implying in this sentence? 'The politician's carefully worded statement managed to acknowledge the crisis without actually committing to any specific action.'",
        options: [
          "The politician doesn't understand the crisis", 
          "The politician is taking decisive action", 
          "The politician is being deliberately vague to avoid responsibility", 
          "The politician needs more information before acting"
        ],
        correctAnswer: 2
      },
      {
        question: "In academic writing, what does it mean to 'critically evaluate' a theory?",
        options: [
          "To express your personal opinion about the theory", 
          "To find faults with the theory", 
          "To summarize what others have said about the theory", 
          "To analyze both strengths and limitations of the theory with supporting evidence"
        ],
        correctAnswer: 3
      },
      {
        question: "Which of these would be considered an example of understatement?",
        options: [
          "The hurricane caused catastrophic destruction across the region", 
          "The sunrise was the most glorious spectacle ever witnessed", 
          "Einstein was a bit clever with his scientific theories", 
          "The explosion was heard from fifty miles away"
        ],
        correctAnswer: 2
      },
      {
        question: "Which phrase most appropriately fills the gap in this academic context? 'The researcher's findings _________ the prevailing theory.'",
        options: [
          "called into question", 
          "thought about", 
          "mentioned", 
          "looked at"
        ],
        correctAnswer: 0
      }
    ],
    
    // Level 6: Expert
    level6: [
      {
        question: "What literary device is exemplified in this passage? 'The ancient oak stood sentinel over the village, its gnarled branches reaching skyward like arthritic fingers, bearing witness to centuries of human drama unfolding beneath its stoic gaze.'",
        options: [
          "Hyperbole", 
          "Onomatopoeia", 
          "Personification", 
          "Alliteration"
        ],
        correctAnswer: 2
      },
      {
        question: "What nuance is best captured by the word 'insidious' in this context? 'The corporation's insidious influence on policy-making remained largely undetected for decades.'",
        options: [
          "Potentially beneficial", 
          "Gradually harmful in a subtle way", 
          "Accidentally disruptive", 
          "Openly aggressive"
        ],
        correctAnswer: 1
      },
      {
        question: "Which interpretation most accurately reflects the subtext of this dialogue? 'Professor: Your paper presents an interesting perspective. Student: I spent all night working on it. Professor: Yes, well, perhaps more time would have been beneficial.'",
        options: [
          "The professor is recommending the student work more efficiently", 
          "The professor is praising the student's time management", 
          "The professor is impressed with the student's dedication", 
          "The professor is suggesting the paper needs improvement despite the effort"
        ],
        correctAnswer: 3
      },
      {
        question: "What is the most precise synonym for 'equivocate' in professional communication?",
        options: [
          "Present complex information simply", 
          "Negotiate effectively", 
          "Use ambiguous language to avoid committing to a position", 
          "Speak clearly and directly"
        ],
        correctAnswer: 2
      },
      {
        question: "Which rhetorical device is employed in this statement by a defense attorney? 'Ladies and gentlemen of the jury, are we to condemn a man based on such flimsy evidence? Are we to destroy a life and family based on mere conjecture? Are we to abandon our sacred principle of 'innocent until proven guilty?",
        options: [
          "Euphemism", 
          "Synecdoche", 
          "Anaphora", 
          "Litotes"
        ],
        correctAnswer: 2
      },
      {
        question: "In academic discourse, what does it mean when a scholar 'problematizes' a concept?",
        options: [
          "Simplifies the concept to make it more accessible", 
          "Identifies practical problems with implementing the concept", 
          "Critically examines the assumptions underlying the concept and reveals complexities", 
          "Demonstrates that the concept is entirely invalid"
        ],
        correctAnswer: 2
      },
      {
        question: "In this sentence, what does the author imply through the use of juxtaposition? 'The billionaire stepped over homeless people on his way to donate to the charity gala.'",
        options: [
          "The billionaire is generous with charitable donations", 
          "Homelessness is a problem even in wealthy areas", 
          "The billionaire is unaware of homelessness", 
          "There is irony in the contrast between the billionaire's wealth and his immediate surroundings"
        ],
        correctAnswer: 3
      },
      {
        question: "Which linguistic concept best describes what happens in the following exchange? 'Person A: Would you mind taking out the trash? Person B: It's not my turn.'",
        options: [
          "Code-switching", 
          "Conversational implicature", 
          "Phonological assimilation", 
          "Syntactic parallelism"
        ],
        correctAnswer: 1
      }
    ]
  };
  
  export default quizData;