export type ExerciseType = "mcq" | "truefalse" | "order";

export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  options?: string[];
  answer: number | number[]; // index for mcq/tf, ordered indices for order
  explanation?: string;
}

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  summary: string;
  minutes: number;
  xp: number;
  keyPoints: string[];
  videoEmbed?: string;
  exercises: Exercise[];
}

export interface Unit {
  id: string;
  levelId: string;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
}

export interface Level {
  id: string;
  number: number;
  title: string;
  description: string;
  units: Unit[];
}

export const levels: Level[] = [
  {
    id: "lvl-1",
    number: 1,
    title: "مقدمة في علوم الحديث",
    description: "ابدأ رحلتك في فهم الحديث الشريف بأسلوب بسيط وممتع.",
    units: [
      {
        id: "u-1-1",
        levelId: "lvl-1",
        title: "ما هو الحديث؟",
        description: "تعرّف على الحديث الشريف ومكانة السنّة في الإسلام.",
        icon: "📖",
        lessons: [
          {
            id: "l-1-1-1",
            unitId: "u-1-1",
            title: "ما هو الحديث الشريف؟",
            summary: "نتعرف على معنى الحديث وكيف وصل إلينا كلام النبي ﷺ.",
            minutes: 3,
            xp: 20,
            keyPoints: [
              "الحديث هو كل ما نُقل عن النبي ﷺ من قول أو فعل أو تقرير.",
              "السنّة هي المصدر الثاني للتشريع بعد القرآن الكريم.",
              "حُفظت الأحاديث بأسانيد متّصلة إلى النبي ﷺ.",
            ],
            exercises: [
              {
                id: "e1",
                type: "mcq",
                question: "ما هو الحديث الشريف؟",
                options: [
                  "كلام الصحابة فقط",
                  "كل ما نُقل عن النبي ﷺ من قول أو فعل أو تقرير",
                  "كتب الفقه القديمة",
                  "أشعار العرب",
                ],
                answer: 1,
                explanation: "الحديث يشمل أقوال النبي ﷺ وأفعاله وتقريراته.",
              },
              {
                id: "e2",
                type: "truefalse",
                question: "السنّة هي المصدر الثاني للتشريع بعد القرآن.",
                options: ["صحيح", "خطأ"],
                answer: 0,
              },
              {
                id: "e3",
                type: "mcq",
                question: "أيّ ممّا يلي يُعدّ من السنّة؟",
                options: [
                  "قصيدة شعرية",
                  "فعل قام به النبي ﷺ",
                  "رأي شخصي حديث",
                  "حُلم رآه شخص",
                ],
                answer: 1,
              },
            ],
          },
          {
            id: "l-1-1-2",
            unitId: "u-1-1",
            title: "لماذا السنّة مهمّة؟",
            summary: "نفهم سبب أهمية اتّباع سنّة النبي ﷺ في حياتنا.",
            minutes: 4,
            xp: 25,
            keyPoints: [
              "السنّة تشرح القرآن الكريم وتُفصّل أحكامه.",
              "السنّة قدوة عملية لنا في كل جوانب الحياة.",
              "بالسنّة نعرف كيف نصلّي ونصوم ونتعامل مع الناس.",
            ],
            exercises: [
              {
                id: "e1",
                type: "mcq",
                question: "من أبرز وظائف السنّة:",
                options: [
                  "بيان وتفصيل أحكام القرآن",
                  "نسخ القرآن بالكامل",
                  "استبدال صلاة الفجر",
                  "لا علاقة لها بالقرآن",
                ],
                answer: 0,
              },
              {
                id: "e2",
                type: "truefalse",
                question: "نعرف عدد ركعات الصلاة من السنّة.",
                options: ["صحيح", "خطأ"],
                answer: 0,
              },
            ],
          },
        ],
      },
      {
        id: "u-1-2",
        levelId: "lvl-1",
        title: "الإسناد والرواة",
        description: "اكتشف معنى السند ودور الرواة في حفظ الحديث.",
        icon: "🔗",
        lessons: [
          {
            id: "l-1-2-1",
            unitId: "u-1-2",
            title: "من هو الراوي؟",
            summary: "نتعرف على الشخص الذي ينقل الحديث ودوره العظيم.",
            minutes: 3,
            xp: 20,
            keyPoints: [
              "الراوي هو الشخص الذي ينقل الحديث عن شيخه.",
              "يجب أن يكون الراوي ثقةً عدلاً ضابطاً.",
              "سلسلة الرواة تُسمّى (السند) أو (الإسناد).",
            ],
            exercises: [
              {
                id: "e1",
                type: "mcq",
                question: "ما هو السند؟",
                options: [
                  "متن الحديث",
                  "سلسلة الرواة الموصلة إلى النبي ﷺ",
                  "اسم الكتاب",
                  "رقم الصفحة",
                ],
                answer: 1,
              },
              {
                id: "e2",
                type: "order",
                question: "رتّب خطوات وصول الحديث إلينا من الأقدم إلى الأحدث:",
                options: [
                  "النبي ﷺ",
                  "الصحابي",
                  "التابعي",
                  "المؤلِّف في الكتاب",
                ],
                answer: [0, 1, 2, 3],
              },
            ],
          },
          {
            id: "l-1-2-2",
            unitId: "u-1-2",
            title: "الفرق بين الصحيح والضعيف",
            summary: "تمييز بسيط بين الحديث الصحيح والحديث الضعيف.",
            minutes: 4,
            xp: 30,
            keyPoints: [
              "الحديث الصحيح: اتّصل سنده برواة ثقات بلا علّة.",
              "الحديث الضعيف: فيه خلل في السند أو الرواة.",
              "العلماء وضعوا قواعد دقيقة للتمييز بينهما.",
            ],
            exercises: [
              {
                id: "e1",
                type: "mcq",
                question: "الحديث الصحيح هو:",
                options: [
                  "ما رواه أيّ شخص",
                  "ما اتّصل سنده برواة ثقات بلا علّة",
                  "ما كان طويلاً",
                  "ما كان في كتاب قديم",
                ],
                answer: 1,
              },
              {
                id: "e2",
                type: "truefalse",
                question: "كلّ حديث في الكتب القديمة صحيح بالضرورة.",
                options: ["صحيح", "خطأ"],
                answer: 1,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "lvl-2",
    number: 2,
    title: "علوم الحديث المتوسطة",
    description: "تعمّق أكثر في أنواع الحديث ومعرفة أحوال الرواة.",
    units: [
      {
        id: "u-2-1",
        levelId: "lvl-2",
        title: "أنواع الأسانيد",
        description: "المتّصل والمنقطع وأقسام أخرى مبسّطة.",
        icon: "🧩",
        lessons: [
          {
            id: "l-2-1-1",
            unitId: "u-2-1",
            title: "المتّصل والمنقطع",
            summary: "نفرّق بين السند المتّصل والمنقطع بأمثلة سهلة.",
            minutes: 4,
            xp: 30,
            keyPoints: [
              "المتّصل: كل راوٍ سمع ممّن فوقه.",
              "المنقطع: سقط منه راوٍ في الوسط.",
              "الاتّصال شرط أساسي لقبول الحديث.",
            ],
            exercises: [
              {
                id: "e1",
                type: "mcq",
                question: "السند المتّصل هو:",
                options: [
                  "ما سقط منه راوٍ",
                  "ما سمع كلّ راوٍ ممّن فوقه",
                  "ما كان قصيراً",
                  "ما كان في كتاب واحد",
                ],
                answer: 1,
              },
            ],
          },
        ],
      },
      {
        id: "u-2-2",
        levelId: "lvl-2",
        title: "مقدّمة في الجرح والتعديل",
        description: "كيف عرف العلماء أحوال الرواة؟",
        icon: "⚖️",
        lessons: [
          {
            id: "l-2-2-1",
            unitId: "u-2-2",
            title: "ما هو الجرح والتعديل؟",
            summary: "علم دراسة أحوال الرواة قبولاً وردّاً.",
            minutes: 5,
            xp: 35,
            keyPoints: [
              "التعديل: الحكم على الراوي بأنّه ثقة.",
              "الجرح: بيان ما يُضعف الراوي.",
              "غاية هذا العلم: حفظ السنّة من الخطأ.",
            ],
            exercises: [
              {
                id: "e1",
                type: "mcq",
                question: "هدف علم الجرح والتعديل هو:",
                options: [
                  "إهانة الرواة",
                  "حفظ السنّة من الخطأ",
                  "تأليف الكتب فقط",
                  "لا هدف له",
                ],
                answer: 1,
              },
              {
                id: "e2",
                type: "truefalse",
                question: "التعديل يعني الحكم على الراوي بالثقة.",
                options: ["صحيح", "خطأ"],
                answer: 0,
              },
            ],
          },
        ],
      },
    ],
  },
];

export const allLessons = levels.flatMap((l) => l.units.flatMap((u) => u.lessons));
export const findLesson = (id: string) => allLessons.find((l) => l.id === id);
export const findUnit = (id: string) =>
  levels.flatMap((l) => l.units).find((u) => u.id === id);
export const findLevelOfLesson = (lessonId: string) =>
  levels.find((lvl) => lvl.units.some((u) => u.lessons.some((l) => l.id === lessonId)));
