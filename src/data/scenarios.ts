import { AgentId } from './agents';

export interface ContractClause {
  number: number;
  title: string;
  text: string;
}

export interface ReplyOption {
  id: string;
  label: string;
  isPrimary: boolean;
  systemComment?: string;
}

export interface StepAgentFinding {
  agentId: AgentId;
  agentLabel: string;
  text: string;
  isBackground?: boolean;
  severity?: 'critical' | 'medium' | 'minor';
}

export interface CompactDossierField {
  key: string;
  label: string;
  value: string;
  tone?: 'neutral' | 'warning' | 'danger';
}

export interface AuditStep {
  stepNumber: number;
  sectionLabel: string;
  clauseNumbers: number[];
  quote: string;
  replies: ReplyOption[];
  activeAgentId: AgentId;
  activeAgentIdsInPipeline: AgentId[];
  completedAgentIdsInPipeline: AgentId[];
  compactSummaryFields: CompactDossierField[];
  findings: StepAgentFinding[];
}

export interface ScenarioOutcome {
  safetyIndex: number;
  verdictType: 'reject' | 'revise' | 'approve';
  verdictBadge: string;
  verdictTitle: string;
  verdictExplanation: string;
  criticalRisks: string[];
  mediumRisks: string[];
  minorRisks: string[];
  enhancerFixes: string[];
}

export interface Scenario {
  id: 'yandex-direct' | 'blogger-integration';
  shortLabel: string;
  title: string;
  channelTag: string;
  budgetSummary: string;
  cardPreview: string;
  entryContext: string;
  clauses: ContractClause[];
  steps: AuditStep[];
  outcome: ScenarioOutcome;
}

export const FREE_INPUT_RESPONSE = 'Это демо-стенд: показан готовый сценарий работы системы';

export const SCENARIOS: Scenario[] = [
  {
    id: 'yandex-direct',
    shortLabel: 'Яндекс.Директ · 100 000 ₽/мес',
    title: 'Яндекс.Директ: 100 000 ₽ в месяц',
    channelTag: 'Контекстная реклама',
    budgetSummary: '100 000 ₽/мес + бюджет',
    cardPreview:
      'Подрядчик просит 100% аванс, не фиксирует рекламный бюджет и перекладывает все штрафы за рекламу и маркировку на заказчика.',
    entryContext:
      'Вы владелец бизнеса. Подрядчик по контекстной рекламе прислал договор на подпись: 100 000 ₽ в месяц + рекламный бюджет. Подписывать?',
    clauses: [
      {
        number: 1,
        title: 'Предмет договора',
        text: 'Исполнитель обязуется оказывать Заказчику услуги по продвижению рекламных материалов в сети Интернет, включая размещение рекламы в Яндекс.Директ, а Заказчик обязуется оплатить данные услуги.',
      },
      {
        number: 2,
        title: 'Обязанности сторон',
        text: 'Исполнитель обязуется: размещать рекламу по своему усмотрению; выбирать ключевые слова и объявления; консультировать Заказчика при необходимости. Заказчик обязуется: предоставить доступ к рекламным кабинетам; своевременно оплачивать услуги; не вмешиваться в процесс размещения рекламы.',
      },
      {
        number: 3,
        title: 'Стоимость и порядок оплаты',
        text: 'Стоимость услуг составляет 100 000 рублей в месяц. Дополнительно Заказчик оплачивает рекламный бюджет в размере по согласованию сторон. Оплата производится авансом.',
      },
      {
        number: 4,
        title: 'Ответственность сторон',
        text: 'Исполнитель не несёт ответственности за результат рекламной кампании. Исполнитель не гарантирует количество заявок, лидов, продаж или иные показатели. Заказчик самостоятельно несёт ответственность за содержание рекламных материалов. Все штрафы, связанные с рекламой, оплачивает Заказчик.',
      },
      {
        number: 5,
        title: 'Особые условия',
        text: 'Исполнитель вправе в одностороннем порядке изменять условия ведения рекламной кампании. Исполнитель вправе приостанавливать рекламу без объяснения причин. KPI не устанавливаются.',
      },
      {
        number: 6,
        title: 'Персональные данные',
        text: 'Заказчик самостоятельно обеспечивает соблюдение законодательства о персональных данных.',
      },
      {
        number: 7,
        title: 'Срок действия',
        text: 'Договор действует бессрочно. Расторжение — за 30 дней.',
      },
    ],
    steps: [
      {
        stepNumber: 1,
        sectionLabel: 'Разделы 1–2 «Предмет и обязанности»',
        clauseNumbers: [1, 2],
        quote:
          'Исполнитель размещает рекламу по своему усмотрению, выбирает ключевые слова и объявления… Заказчик обязуется не вмешиваться в процесс размещения рекламы',
        replies: [
          {
            id: 'yd-1-primary',
            label: 'Подрядчик сам решает, что и где показывать — это нормально?',
            isPrimary: true,
          },
          {
            id: 'yd-1-alt1',
            label: 'Выглядит стандартно, идём дальше',
            isPrimary: false,
            systemComment:
              'Стандартно — да. Но именно так пишут договоры-пустышки. Смотрите, что уже нашёл Аналитик.',
          },
          {
            id: 'yd-1-alt2',
            label: 'Что значит “консультировать при необходимости”?',
            isPrimary: false,
            systemComment:
              'Классическая размытая формулировка без результата — первый признак договора-пустышки.',
          },
        ],
        activeAgentId: 'analyst',
        activeAgentIdsInPipeline: ['analyst', 'antagonist'],
        completedAgentIdsInPipeline: [],
        compactSummaryFields: [
          {
            key: 'contractType',
            label: 'Тип и модель оплаты',
            value: 'Договор услуг · Фикс 100 000 ₽/мес',
            tone: 'neutral',
          },
          {
            key: 'kpiStages',
            label: 'KPI и этапы работ',
            value: 'Отсутствуют · результат не сформулирован',
            tone: 'warning',
          },
          {
            key: 'emptinessRisk',
            label: 'Пометка Аналитика',
            value: 'Размытые формулировки — риск пустышки',
            tone: 'danger',
          },
        ],
        findings: [
          {
            agentId: 'analyst',
            agentLabel: 'Аналитик договора',
            text: 'Тип — договор услуг; оплата — фикс; KPI и этапы — отсутствуют; обещанный результат не сформулирован. Пометка: «размытые формулировки — риск пустышки».',
          },
          {
            agentId: 'antagonist',
            agentLabel: 'Антагонист подрядчика',
            text: '«Отлично: заказчик по договору не вмешивается. Буду крутить что хочу — лишь бы клики шли, а заявки его не касаются».',
          },
        ],
      },
      {
        stepNumber: 2,
        sectionLabel: 'Раздел 3 «Деньги»',
        clauseNumbers: [3],
        quote:
          'Стоимость — 100 000 ₽ в месяц, оплата авансом. Рекламный бюджет — по согласованию сторон',
        replies: [
          {
            id: 'yd-2-primary',
            label: 'Аванс и бюджет без суммы — где тут риск?',
            isPrimary: true,
          },
          {
            id: 'yd-2-alt1',
            label: '100 тысяч в месяц — адекватная цена',
            isPrimary: false,
            systemComment:
              'Возможно. Но без потолка бюджета и отчётности вы платите вслепую — цена тут не главное.',
          },
          {
            id: 'yd-2-alt2',
            label: 'Что значит “бюджет по согласованию”?',
            isPrimary: false,
            systemComment:
              'Что в договоре нет ни суммы, ни потолка: подрядчик сможет запросить любой бюджет — хоть в переписке.',
          },
        ],
        activeAgentId: 'balance',
        activeAgentIdsInPipeline: ['balance', 'antagonist'],
        completedAgentIdsInPipeline: ['analyst'],
        compactSummaryFields: [
          {
            key: 'contractType',
            label: 'Тип и модель оплаты',
            value: 'Договор услуг · 100% аванс 100 000 ₽/мес',
            tone: 'warning',
          },
          {
            key: 'budgetRisk',
            label: 'Контроль бюджета',
            value: 'Потолка нет · отчётность не прописана',
            tone: 'danger',
          },
          {
            key: 'emptinessRisk',
            label: 'Риск слива бюджета',
            value: 'Риск «легально слить бюджет» подтверждён',
            tone: 'danger',
          },
        ],
        findings: [
          {
            agentId: 'balance',
            agentLabel: 'Аналитик баланса',
            text: 'Риск «легально слить бюджет» — потолка нет, аванс 100%, отчётность о расходах не прописана.',
          },
          {
            agentId: 'antagonist',
            agentLabel: 'Антагонист подрядчика',
            text: '«Запрошу бюджет побольше: “согласование” — это просто чат, а отказывать каждый раз неудобно».',
          },
        ],
      },
      {
        stepNumber: 3,
        sectionLabel: 'Раздел 4 «Ответственность»',
        clauseNumbers: [4],
        quote:
          'Исполнитель не несёт ответственности за результат… Все штрафы, связанные с рекламой, оплачивает Заказчик',
        replies: [
          {
            id: 'yd-3-primary',
            label: 'Все штрафы на мне? Это вообще законно?',
            isPrimary: true,
          },
          {
            id: 'yd-3-alt1',
            label: 'Подрядчики никогда не гарантируют результат',
            isPrimary: false,
            systemComment:
              'Не гарантировать продажи — нормально. А вот перекладывать на вас штрафы за маркировку — нет.',
          },
          {
            id: 'yd-3-alt2',
            label: 'А что за штрафы за рекламу?',
            isPrimary: false,
            systemComment:
              'За рекламу без маркировки штрафы для компании доходят до 500 000 ₽ — и по этому договору платить будете вы.',
          },
        ],
        activeAgentId: 'lawyer',
        activeAgentIdsInPipeline: ['lawyer', 'balance'],
        completedAgentIdsInPipeline: ['analyst'],
        compactSummaryFields: [
          {
            key: 'legalMarking',
            label: 'Маркировка и штрафы',
            value: 'Блок маркировки отсутствует · штрафы на заказчике',
            tone: 'danger',
          },
          {
            key: 'balanceSplit',
            label: 'Баланс ответственности',
            value: '100% на заказчике · подрядчик не рискует ничем',
            tone: 'danger',
          },
          {
            key: 'budgetRisk',
            label: 'Контроль бюджета',
            value: 'Потолка нет · 100% аванс без отчёта',
            tone: 'danger',
          },
        ],
        findings: [
          {
            agentId: 'lawyer',
            agentLabel: 'Юрист',
            text: 'Ответственность подрядчика обнулена; штрафы по закону о рекламе переложены на заказчика; блок маркировки в договоре отсутствует — риск нарушений.',
          },
          {
            agentId: 'balance',
            agentLabel: 'Аналитик баланса',
            text: 'Перекос ответственности — 100% на заказчике, подрядчик не рискует ничем.',
          },
        ],
      },
      {
        stepNumber: 4,
        sectionLabel: 'Раздел 5 «Особые условия»',
        clauseNumbers: [5],
        quote:
          'Исполнитель вправе в одностороннем порядке изменять условия ведения кампании… приостанавливать рекламу без объяснения причин. KPI не устанавливаются',
        replies: [
          {
            id: 'yd-4-primary',
            label: 'Он может менять условия без моего согласия?',
            isPrimary: true,
          },
          {
            id: 'yd-4-alt1',
            label: 'KPI по рекламе сложно гарантировать',
            isPrimary: false,
            systemComment:
              'Продажи — да, сложно. Но KPI по охвату, цене заявки и отчётности ставить можно и нужно.',
          },
          {
            id: 'yd-4-alt2',
            label: 'Приостановить рекламу без объяснений — а я так могу?',
            isPrimary: false,
            systemComment:
              'Нет. Право одностороннее — только у подрядчика. Симметрии в договоре нет вообще.',
          },
        ],
        activeAgentId: 'antagonist',
        activeAgentIdsInPipeline: ['antagonist', 'critic'],
        completedAgentIdsInPipeline: ['analyst', 'lawyer', 'balance'],
        compactSummaryFields: [
          {
            key: 'unilateralTerms',
            label: 'Управление кампанией',
            value: 'Одностороннее изменение и остановка без причин',
            tone: 'danger',
          },
          {
            key: 'kpiStages',
            label: 'KPI и отчётность',
            value: 'KPI прямо запрещены договором',
            tone: 'danger',
          },
          {
            key: 'criticSignal',
            label: 'Фиксация Критика',
            value: '🔴 Критический риск: односторонние условия',
            tone: 'danger',
          },
        ],
        findings: [
          {
            agentId: 'antagonist',
            agentLabel: 'Антагонист подрядчика',
            text: '«Остановлю кампанию в разгар сезона — и буду формально прав. Или поменяю условия так, как удобно мне».',
          },
          {
            agentId: 'critic',
            agentLabel: 'Критик (в фоне)',
            text: 'Фиксирует 🔴 односторонние изменения условий.',
            isBackground: true,
            severity: 'critical',
          },
        ],
      },
      {
        stepNumber: 5,
        sectionLabel: 'Разделы 6–7 «Данные и выход»',
        clauseNumbers: [6, 7],
        quote:
          'Договор бессрочный, расторжение — за 30 дней. Соблюдение закона о персональных данных обеспечивает Заказчик',
        replies: [
          {
            id: 'yd-5-primary',
            label: 'Что будет, если я захочу уйти?',
            isPrimary: true,
          },
          {
            id: 'yd-5-alt1',
            label: '30 дней на расторжение — терпимо',
            isPrimary: false,
            systemComment:
              'Терпимо. Но с авансом и без отчётности вы заплатите ещё минимум месяц ни за что.',
          },
          {
            id: 'yd-5-alt2',
            label: 'При чём тут персональные данные?',
            isPrimary: false,
            systemComment:
              'Заявки и лиды из рекламы — это персональные данные. Договор перекладывает всю ответственность за них на вас.',
          },
        ],
        activeAgentId: 'lawyer',
        activeAgentIdsInPipeline: ['lawyer', 'critic', 'enhancer'],
        completedAgentIdsInPipeline: ['analyst', 'balance', 'antagonist'],
        compactSummaryFields: [
          {
            key: 'personalData',
            label: 'Персональные данные (лиды)',
            value: 'Формальный пункт — вся ответственность на заказчике',
            tone: 'warning',
          },
          {
            key: 'exitClause',
            label: 'Выход из договора',
            value: 'Бессрочный · уведомление за 30 дней при авансе',
            tone: 'warning',
          },
          {
            key: 'pipelineStatus',
            label: 'Конвейер агентов',
            value: 'Критик и Улучшатель формируют итоговый вердикт',
            tone: 'neutral',
          },
        ],
        findings: [
          {
            agentId: 'lawyer',
            agentLabel: 'Юрист',
            text: 'Блок персональных данных написан формально — при проблеме с лидами отвечать будет заказчик.',
          },
          {
            agentId: 'critic',
            agentLabel: 'Критик',
            text: 'Собирает все находки конвейера.',
          },
          {
            agentId: 'enhancer',
            agentLabel: 'Улучшатель',
            text: 'Готовит правки и вердикт.',
          },
        ],
      },
    ],
    outcome: {
      safetyIndex: 17,
      verdictType: 'reject',
      verdictBadge: 'Не подписывать',
      verdictTitle: '❌ Не подписывать.',
      verdictExplanation:
        'В текущем виде договор позволяет подрядчику получать деньги без результата и без ответственности. 4 критических риска.',
      criticalRisks: [
        'нет ответственности за результат и нет KPI',
        'все штрафы и маркировка — на заказчике',
        'одностороннее изменение условий и остановка рекламы без причин',
        'бюджет без потолка + 100% аванс',
      ],
      mediumRisks: [
        'расторжение за 30 дней при полной предоплате',
        'нет отчётности о расходах бюджета',
        'персональные данные целиком на заказчике',
      ],
      minorRisks: [
        'размытая «консультационная» формулировка услуг',
        '«согласование сторон» без процедуры и сроков',
      ],
      enhancerFixes: [
        'добавить KPI (охват, цена заявки) и еженедельную отчётность',
        'зафиксировать потолок рекламного бюджета в договоре',
        'маркировку и штрафы за неё перенести на подрядчика',
        'запретить односторонние изменения условий',
        'оплату привязать к этапам, а не к 100% авансу',
        'расторжение — за 7 дней с возвратом неизрасходованного аванса',
      ],
    },
  },
  {
    id: 'blogger-integration',
    shortLabel: 'Блогер · 350 000 ₽',
    title: 'Интеграция у блогера за 350 000 ₽',
    channelTag: 'Инфлюенсеры · VK Video / RuTube',
    budgetSummary: '350 000 ₽ · 100% аванс',
    cardPreview:
      'Устная интеграция до 60 секунд в одном ролике. Текст выглядит деловым и аккуратным, но без единой гарантии просмотров и места в видео.',
    entryContext:
      'Блогер с каналом на VK Video / RuTube прислал договор: устная интеграция до 60 секунд в одном ролике за 350 000 ₽. Выглядит прилично. Так ли это?',
    clauses: [
      {
        number: 1,
        title: 'Предмет договора',
        text: 'Исполнитель обязуется разместить рекламную интеграцию Заказчика в видеоконтенте блогера на платформе VK Video / RuTube. Формат: устная интеграция длительностью до 60 секунд в одном видеоролике.',
      },
      {
        number: 2,
        title: 'Обязанности Исполнителя',
        text: 'Разместить интеграцию в одном видеоролике; обеспечить публикацию ролика на своём канале; не удалять ролик в течение 30 дней с момента публикации; предоставить ссылку на размещение.',
      },
      {
        number: 3,
        title: 'Обязанности Заказчика',
        text: 'Предоставить рекламные материалы; согласовать текст интеграции в течение 24 часов; оплатить услуги.',
      },
      {
        number: 4,
        title: 'Стоимость',
        text: 'Стоимость интеграции: 350 000 рублей. Оплата производится 100% авансом.',
      },
      {
        number: 5,
        title: 'KPI и показатели',
        text: 'Исполнитель не гарантирует конкретное количество просмотров. Ожидаемые показатели просмотров являются ориентировочными. Отсутствие достижения ожидаемых показателей не является основанием для возврата средств.',
      },
      {
        number: 6,
        title: 'Ограничение ответственности',
        text: 'Исполнитель не несёт ответственности за действия алгоритмов платформы, снижение охватов, негативные комментарии. Исполнитель не гарантирует конверсию, переходы или продажи.',
      },
      {
        number: 7,
        title: 'Особые условия',
        text: 'Интеграция считается выполненной с момента публикации видео. Исполнитель вправе самостоятельно определять подачу рекламного материала. Исполнитель вправе интегрировать рекламу в любом месте ролика.',
      },
      {
        number: 8,
        title: 'Маркировка рекламы',
        text: 'Маркировка рекламы осуществляется по согласованию сторон.',
      },
      {
        number: 9,
        title: 'Расторжение',
        text: 'Возврат средств после публикации не осуществляется.',
      },
    ],
    steps: [
      {
        stepNumber: 1,
        sectionLabel: 'Раздел 1 «Предмет и формат»',
        clauseNumbers: [1],
        quote: 'Устная интеграция длительностью до 60 секунд в одном видеоролике',
        replies: [
          {
            id: 'bl-1-primary',
            label: '“До 60 секунд” — это сколько на практике?',
            isPrimary: true,
          },
          {
            id: 'bl-1-alt1',
            label: 'Один ролик за 350 тысяч — маловато',
            isPrimary: false,
            systemComment:
              'Цена — вопрос рынка. Но за такие деньги тем более нужны гарантии — а их мы пока не видим.',
          },
          {
            id: 'bl-1-alt2',
            label: 'А что входит в “устную интеграцию”?',
            isPrimary: false,
            systemComment:
              'Формат не расписан: без сценария и согласования подачи блогер прочитает что угодно и как угодно.',
          },
        ],
        activeAgentId: 'analyst',
        activeAgentIdsInPipeline: ['analyst', 'antagonist'],
        completedAgentIdsInPipeline: [],
        compactSummaryFields: [
          {
            key: 'contractType',
            label: 'Тип и формат',
            value: 'Размещение рекламы (услуга) · до 60 сек',
            tone: 'neutral',
          },
          {
            key: 'resultDef',
            label: 'Зафиксированный результат',
            value: 'Сам факт размещения · сценарий не приложен',
            tone: 'warning',
          },
          {
            key: 'antagonistHook',
            label: 'Лазейка формата',
            value: '«До 60 секунд» допускает и 12 секунд',
            tone: 'danger',
          },
        ],
        findings: [
          {
            agentId: 'analyst',
            agentLabel: 'Аналитик договора',
            text: 'Тип — размещение рекламы (услуга); результат зафиксирован как «сам факт размещения», а не эффект; сценарий интеграции не приложен.',
          },
          {
            agentId: 'antagonist',
            agentLabel: 'Антагонист подрядчика',
            text: '«“До 60 секунд” — значит, и 12 секунд сойдут. Формально выполнено».',
          },
        ],
      },
      {
        stepNumber: 2,
        sectionLabel: 'Разделы 2–3 «Обязанности сторон»',
        clauseNumbers: [2, 3, 4],
        quote:
          'Не удалять ролик в течение 30 дней… Заказчик согласовывает текст интеграции в течение 24 часов',
        replies: [
          {
            id: 'bl-2-primary',
            label: 'Ролик могут удалить уже через месяц?',
            isPrimary: true,
          },
          {
            id: 'bl-2-alt1',
            label: 'Согласовать текст за 24 часа — успею',
            isPrimary: false,
            systemComment:
              'Успеете. Но что будет, если не успеете, — в договоре не написано, а риск остаётся на вас.',
          },
          {
            id: 'bl-2-alt2',
            label: 'Ссылка на размещение — это гарантия?',
            isPrimary: false,
            systemComment:
              'Это подтверждение факта публикации, не качества: ссылка есть — обязательство выполнено.',
          },
        ],
        activeAgentId: 'balance',
        activeAgentIdsInPipeline: ['balance', 'antagonist'],
        completedAgentIdsInPipeline: ['analyst'],
        compactSummaryFields: [
          {
            key: 'lifeSpan',
            label: 'Срок жизни ролика',
            value: 'Всего 30 дней · долгосрочный эффект не защищён',
            tone: 'danger',
          },
          {
            key: 'approvalWindow',
            label: 'Согласование текста',
            value: 'Жёсткие 24 часа для заказчика',
            tone: 'warning',
          },
          {
            key: 'antagonistHook',
            label: 'Сценарий Антагониста',
            value: 'На 31-й день ролик можно удалить или скрыть',
            tone: 'danger',
          },
        ],
        findings: [
          {
            agentId: 'balance',
            agentLabel: 'Аналитик баланса',
            text: 'Срок жизни интеграции — всего 30 дней; долгосрочного эффекта договор не защищает.',
          },
          {
            agentId: 'antagonist',
            agentLabel: 'Антагонист подрядчика',
            text: '«На 31-й день удалю ролик — чисто. А могу и не удалять, но скрыть из рекомендаций».',
          },
        ],
      },
      {
        stepNumber: 3,
        sectionLabel: 'Раздел 5 «KPI и показатели»',
        clauseNumbers: [5],
        quote:
          'Исполнитель не гарантирует количество просмотров. Ожидаемые показатели — ориентировочные. Недостижение — не основание для возврата',
        replies: [
          {
            id: 'bl-3-primary',
            label: 'Значит, просмотров может быть почти ноль?',
            isPrimary: true,
          },
          {
            id: 'bl-3-alt1',
            label: 'У блогера же есть статистика канала',
            isPrimary: false,
            systemComment:
              'Есть. Но “ожидаемые показатели” юридически ни к чему не обязывают — это главная ловушка договора.',
          },
          {
            id: 'bl-3-alt2',
            label: 'Как тогда понять, что плачу не зря?',
            isPrimary: false,
            systemComment:
              'Просить минимальный гарантированный охват или компенсацию при недоборе — на рынке это стандартная практика.',
          },
        ],
        activeAgentId: 'balance',
        activeAgentIdsInPipeline: ['balance', 'antagonist'],
        completedAgentIdsInPipeline: ['analyst'],
        compactSummaryFields: [
          {
            key: 'reachGuarantee',
            label: 'Гарантия просмотров',
            value: 'Ноль гарантий при 100% авансе 350 000 ₽',
            tone: 'danger',
          },
          {
            key: 'resultDef',
            label: 'Риск сделки',
            value: '«Заплатили — результата нет» в чистом виде',
            tone: 'danger',
          },
          {
            key: 'antagonistHook',
            label: 'Приём Антагониста',
            value: 'Выход в мёртвое время — 500 просмотров и нет возврата',
            tone: 'danger',
          },
        ],
        findings: [
          {
            agentId: 'balance',
            agentLabel: 'Аналитик баланса',
            text: 'Риск «заплатили — результата нет» в чистом виде: ноль гарантий при полной предоплате.',
          },
          {
            agentId: 'antagonist',
            agentLabel: 'Антагонист подрядчика',
            text: '«Выложу ролик в мёртвое время, наберёт 500 просмотров — “ожидания” не обещал, я чист».',
          },
        ],
      },
      {
        stepNumber: 4,
        sectionLabel: 'Разделы 6–7 «Ответственность и место интеграции»',
        clauseNumbers: [6, 7],
        quote:
          'Исполнитель не отвечает за алгоритмы, охваты и комментарии… вправе интегрировать рекламу в любом месте ролика. Интеграция считается выполненной с момента публикации',
        replies: [
          {
            id: 'bl-4-primary',
            label: 'Интеграция “в любом месте ролика” — в чём подвох?',
            isPrimary: true,
          },
          {
            id: 'bl-4-alt1',
            label: 'За алгоритмы платформы правда никто не отвечает',
            isPrimary: false,
            systemComment:
              'За алгоритмы — нет. Но минимальный охват и место в ролике зафиксировать можно.',
          },
          {
            id: 'bl-4-alt2',
            label: 'Что значит “выполнено с момента публикации”?',
            isPrimary: false,
            systemComment:
              'Что деньги становятся его в момент публикации — даже если реклама в самом конце ролика, который никто не досмотрит.',
          },
        ],
        activeAgentId: 'antagonist',
        activeAgentIdsInPipeline: ['antagonist', 'critic'],
        completedAgentIdsInPipeline: ['analyst', 'balance'],
        compactSummaryFields: [
          {
            key: 'placementSlot',
            label: 'Место в ролике',
            value: 'Не зафиксировано — вплоть до последней минуты',
            tone: 'danger',
          },
          {
            key: 'acceptanceMoment',
            label: 'Момент выполнения',
            value: 'С момента публикации, без проверки досмотра',
            tone: 'warning',
          },
          {
            key: 'criticSignal',
            label: 'Фиксация Критика',
            value: '🔴 Критический риск: место интеграции не зафиксировано',
            tone: 'danger',
          },
        ],
        findings: [
          {
            agentId: 'antagonist',
            agentLabel: 'Антагонист подрядчика',
            text: '«Вставлю рекламу на последней минуте ролика — формально всё выполнено, претензий не примете».',
          },
          {
            agentId: 'critic',
            agentLabel: 'Критик (в фоне)',
            text: 'Фиксирует 🔴 «место интеграции не зафиксировано».',
            isBackground: true,
            severity: 'critical',
          },
        ],
      },
      {
        stepNumber: 5,
        sectionLabel: 'Разделы 8–9 «Маркировка и расторжение»',
        clauseNumbers: [8, 9],
        quote:
          'Маркировка рекламы осуществляется по согласованию сторон. Возврат средств после публикации не осуществляется',
        replies: [
          {
            id: 'bl-5-primary',
            label: '“Маркировка по согласованию” — это как?',
            isPrimary: true,
          },
          {
            id: 'bl-5-alt1',
            label: 'Блогер сам разберётся с маркировкой',
            isPrimary: false,
            systemComment:
              'Закон распределяет обязанности на всю цепочку — штраф может прийти и вам как рекламодателю.',
          },
          {
            id: 'bl-5-alt2',
            label: 'Почему нельзя вернуть деньги?',
            isPrimary: false,
            systemComment:
              '100% аванс плюс запрет возврата — весь риск на вас. Рынок обычно работает 50/50.',
          },
        ],
        activeAgentId: 'lawyer',
        activeAgentIdsInPipeline: ['lawyer', 'critic', 'enhancer'],
        completedAgentIdsInPipeline: ['analyst', 'balance', 'antagonist'],
        compactSummaryFields: [
          {
            key: 'markingRisk',
            label: 'Маркировка рекламы',
            value: 'Обязанности по закону не распределены — главный юр. риск',
            tone: 'danger',
          },
          {
            key: 'refundClause',
            label: 'Возврат средств',
            value: 'Запрет возврата после публикации при 100% авансе',
            tone: 'danger',
          },
          {
            key: 'pipelineStatus',
            label: 'Конвейер агентов',
            value: 'Критик и Улучшатель формируют итоговый вердикт',
            tone: 'neutral',
          },
        ],
        findings: [
          {
            agentId: 'lawyer',
            agentLabel: 'Юрист',
            text: 'Маркировка — главный юридический риск сделки: обязанности сторон по закону о рекламе не распределены.',
          },
          {
            agentId: 'critic',
            agentLabel: 'Критик',
            text: 'Собирает находки.',
          },
          {
            agentId: 'enhancer',
            agentLabel: 'Улучшатель',
            text: 'Готовит правки и вердикт.',
          },
        ],
      },
    ],
    outcome: {
      safetyIndex: 46,
      verdictType: 'revise',
      verdictBadge: 'Подписывать только после правок',
      verdictTitle: '⚠️ Подписывать только после правок.',
      verdictExplanation:
        'Сделка реальная, но в текущем виде весь риск на вас: 350 000 ₽ авансом без единой гарантии. После правок договор станет рабочим.',
      criticalRisks: [
        'нет гарантии охвата при 100% авансе и запрете возврата',
        'место интеграции в ролике не зафиксировано',
      ],
      mediumRisks: [
        'маркировка рекламы не распределена между сторонами',
        'ролик живёт всего 30 дней',
        'нет компенсации при недоборе просмотров',
      ],
      minorRisks: [
        'срок согласования текста 24 часа — жёсткий для заказчика',
        'нет механизма работы с негативными комментариями',
      ],
      enhancerFixes: [
        'минимальный гарантированный охват (например, не ниже 70% среднего по каналу) или бонусное размещение при недоборе',
        'интеграция в первой половине ролика, сценарий согласуется до съёмки',
        'оплата 50% авансом и 50% после публикации и подтверждения охвата',
        'маркировку и штрафы за неё — на исполнителя, заказчик только предоставляет данные',
        'срок жизни ролика — не менее 6 месяцев',
        'возврат 50%, если ролик не вышел в срок',
      ],
    },
  },
];
