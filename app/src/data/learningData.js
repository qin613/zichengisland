/**
 * 学习模块数据
 * 高等数学 / 线性代数 / 考研英语 / 数据结构 / 计算机组成原理 / 操作系统 / 计算机网络
 */

export const SUBJECTS = [
  { key: 'advancedMath', label: '高等数学', icon: '∫', color: '#ff6b6b' },
  { key: 'linearAlgebra', label: '线性代数', icon: '⊤', color: '#48dbfb' },
  { key: 'english', label: '英语', icon: '📖', color: '#feca57' },
  { key: 'dataStructure', label: '数据结构', icon: '🌳', color: '#26de81' },
  { key: 'computerOrganization', label: '计算机组成原理', icon: '🔧', color: '#a29bfe' },
  { key: 'operatingSystem', label: '操作系统', icon: '⚙️', color: '#fd79a8' },
  { key: 'computerNetwork', label: '计算机网络', icon: '🌐', color: '#00cec9' }
]

export const DIFFICULTIES = [
  { key: 'basic', label: '基础', desc: '入门知识，轻松上手' },
  { key: 'intermediate', label: '进阶', desc: '有一定难度，需要思考' },
  { key: 'advanced', label: '挑战', desc: '深入理解，综合运用' }
]

/** 英语子类别 */
export const ENGLISH_SUB_CATEGORIES = [
  { key: 'postgraduate', label: '考研英语', icon: '🎯', desc: '考研英语一/二题型，词汇·阅读·翻译·写作' },
  { key: 'cet4', label: '四级英语', icon: '📘', desc: '大学英语四级题型，词汇·阅读·翻译' },
  { key: 'cet6', label: '六级英语', icon: '📙', desc: '大学英语六级题型，词汇·阅读·翻译' }
]

/** 高等数学题库 */
export const ADVANCED_MATH_QUIZZES = {
  basic: [
    {
      type: 'calc',
      question: '求极限：lim(x→0) sin x / x = ?',
      answer: 1,
      hint: '重要极限',
      explanation: '这是第一个重要极限，lim(x→0) sin x / x = 1，在微积分中具有基础性地位。'
    },
    {
      type: 'choice',
      question: '函数 f(x) = x² 在 x = 2 处的导数是多少？',
      options: ['2', '4', '0', '1'],
      answer: 1,
      explanation: "f'(x) = 2x，代入 x = 2 得 f'(2) = 4。导数表示函数在该点的瞬时变化率。"
    },
    {
      type: 'fill',
      question: '求不定积分：∫ 2x dx = ?（常数C不填）',
      answer: 'x^2',
      hint: '幂函数积分公式',
      explanation: '∫ 2x dx = x² + C，使用幂函数积分公式 ∫ xⁿ dx = xⁿ⁺¹/(n+1) + C。'
    },
    {
      type: 'choice',
      question: '下列哪个是无穷小量？',
      options: ['x → ∞ 时的 1/x', 'x → 0 时的 1/x', 'x → 0 时的 x²', 'A和C都是'],
      answer: 3,
      explanation: '无穷小量是极限为0的量。x → ∞ 时 1/x → 0，x → 0 时 x² → 0，x → 0 时 1/x → ∞ 是无穷大量。'
    },
    {
      type: 'fill',
      question: '求函数 y = ln x 的导数 dy/dx = ?',
      answer: '1/x',
      hint: '基本求导公式',
      explanation: '(ln x)\' = 1/x，这是对数函数的基本求导公式。'
    },
    {
      type: 'choice',
      question: '曲线 y = x² 在点 (1,1) 处的切线斜率是？',
      options: ['1', '2', '0', '-1'],
      answer: 1,
      explanation: "y' = 2x，在 x = 1 处斜率为 2。切线斜率等于该点处的导数值。"
    },
    {
      type: 'calc',
      question: '求极限：lim(x→0) (eˣ - 1)/x = ?',
      answer: 1,
      hint: '等价无穷小',
      explanation: '这是第二个重要极限的变形，eˣ - 1 ~ x (x→0)，所以极限为 1。'
    },
    {
      type: 'calc',
      question: '∫₀¹ x dx = ?',
      answer: 0.5,
      hint: '定积分几何意义',
      explanation: '∫₀¹ x dx = [x²/2]₀¹ = 1/2。定积分表示曲线下的面积。'
    },
    {
      type: 'choice',
      question: '函数 f(x) = eˣ 的导数是？',
      options: ['eˣ', 'xeˣ⁻¹', 'eˣ·ln e', 'ln x'],
      answer: 0,
      explanation: '(eˣ)\' = eˣ，指数函数的导数等于它本身，这是微积分中一个特殊的性质。'
    },
    {
      type: 'choice',
      question: '以下哪个函数在 x=0 处不可导？',
      options: ['x²', 'sin x', '|x|', 'eˣ'],
      answer: 2,
      explanation: '|x| 在 x=0 处左右导数不相等（左导数为 -1，右导数为 1），故不可导，但连续。'
    },
    {
      type: 'calc',
      question: 'lim(x→∞) (1 + 1/x)ˣ = e，求 e 的近似值（取整数部分）',
      answer: 2,
      hint: '自然常数',
      explanation: 'lim(x→∞) (1 + 1/x)ˣ = e ≈ 2.71828。这是第二个重要极限，e 是自然常数。'
    }
  ],
  intermediate: [
    {
      type: 'calc',
      question: '求定积分：∫₀^π sin x dx = ?',
      answer: 2,
      hint: 'sin x 的原函数是 -cos x',
      explanation: '∫₀^π sin x dx = [-cos x]₀^π = -cosπ - (-cos0) = -(-1) + 1 = 2。'
    },
    {
      type: 'choice',
      question: '微分方程 dy/dx = 2x 的通解是？',
      options: ['y = x² + C', 'y = 2x + C', 'y = x²', 'y = 2x² + C'],
      answer: 0,
      explanation: 'dy/dx = 2x，两边积分得 y = ∫ 2x dx = x² + C。'
    },
    {
      type: 'calc',
      question: '求函数 z = x² + y² 的偏导数 ∂z/∂x 在点 (1,2) 处的值',
      answer: 2,
      hint: '对 x 求偏导时 y 视为常数',
      explanation: '∂z/∂x = 2x，代入 x = 1 得 2。'
    },
    {
      type: 'calc',
      question: '求曲线 y = x³ - 3x + 1 的拐点横坐标',
      answer: 0,
      hint: '令 y" = 0',
      explanation: 'y\' = 3x² - 3，y" = 6x，令 y" = 0 得 x = 0。当 x < 0 时 y" < 0，x > 0 时 y" > 0，故 (0,1) 为拐点。'
    },
    {
      type: 'choice',
      question: '下列级数中收敛的是？',
      options: ['∑(n=1→∞) 1/n', '∑(n=1→∞) 1/n²', '∑(n=1→∞) n', '∑(n=1→∞) (-1)ⁿ'],
      answer: 1,
      explanation: 'p-级数 ∑ 1/nᵖ 在 p > 1 时收敛。∑ 1/n² 的 p = 2 > 1，收敛。∑ 1/n 是调和级数，发散。'
    },
    {
      type: 'calc',
      question: '计算二重积分 ∬_D (x + y) dσ，其中 D: 0≤x≤1, 0≤y≤1',
      answer: 1,
      hint: '先对 y 积分再对 x 积分',
      explanation: '∬_D (x+y)dσ = ∫₀¹∫₀¹ (x+y)dy dx = ∫₀¹ [xy + y²/2]₀¹ dx = ∫₀¹ (x + 1/2)dx = [x²/2 + x/2]₀¹ = 1。'
    },
    {
      type: 'choice',
      question: '函数 f(x) = |x| 在 x = 0 处？',
      options: ['可导', '不可导但连续', '不连续', '既不可导也不连续'],
      answer: 1,
      explanation: '|x| 在 x=0 处连续，但左导数 = -1，右导数 = 1，左右导数不相等，故不可导。'
    },
    {
      type: 'calc',
      question: '求由曲线 y = x² 与 y = x 所围成的图形面积',
      answer: 0.1667,
      hint: '先求交点，再用定积分',
      explanation: '交点为 (0,0) 和 (1,1)。面积 = ∫₀¹ (x - x²)dx = [x²/2 - x³/3]₀¹ = 1/2 - 1/3 = 1/6 ≈ 0.1667。'
    },
    {
      type: 'choice',
      question: '函数 f(x) = sin x 在 x = 0 处的泰勒展开式的前两项是？',
      options: ['x - x³/6', '1 - x²/2', 'x + x²/2', '1 + x'],
      answer: 0,
      explanation: 'sin x = x - x³/3! + x⁵/5! - ...，所以前两项为 x - x³/6。'
    },
    {
      type: 'calc',
      question: '求微分方程 dy/dx = y 的通解中，lny = ?（答案格式：x + C）',
      answer: 'x + C',
      hint: '分离变量法',
      explanation: 'dy/dx = y → dy/y = dx → ∫ dy/y = ∫ dx → ln|y| = x + C。'
    }
  ],
  advanced: [
    {
      type: 'analysis',
      question: '用拉格朗日中值定理证明：当 x > 0 时，ln(1+x) < x。',
      answer: '令 f(t) = ln(1+t)，在 [0,x] 上应用拉格朗日中值定理：存在 ξ ∈ (0,x) 使得 f(x)-f(0) = f\'(ξ)(x-0)，即 ln(1+x) = x/(1+ξ)。因为 1+ξ > 1，所以 x/(1+ξ) < x，故 ln(1+x) < x。',
      explanation: '拉格朗日中值定理建立了函数增量与导数之间的联系，是证明不等式的重要工具。'
    },
    {
      type: 'analysis',
      question: '判断级数 ∑(n=1→∞) (-1)ⁿ/n 是否收敛？如果收敛，是绝对收敛还是条件收敛？',
      answer: '由莱布尼茨判别法，(-1)ⁿ/n 是交错级数，满足：1/n 单调递减且 lim(n→∞) 1/n = 0，故级数收敛。又 ∑|(-1)ⁿ/n| = ∑ 1/n 发散（调和级数），所以原级数条件收敛。',
      explanation: '条件收敛是指级数本身收敛但绝对值级数发散。这是典型条件收敛的例子。'
    },
    {
      type: 'calc',
      question: '求曲面 z = x² + y² 在点 (1,1,2) 处的切平面方程中 z 的系数（即法向量的 z 分量）',
      answer: -1,
      hint: '令 F(x,y,z) = x² + y² - z',
      explanation: '令 F(x,y,z) = x² + y² - z = 0，梯度 ∇F = (2x, 2y, -1)。在 (1,1,2) 处法向量为 (2,2,-1)，z 分量为 -1。'
    },
    {
      type: 'calc',
      question: '求函数 f(x) = x³ - 3x 在区间 [-2,2] 上的最大值',
      answer: 2,
      hint: '比较极值点和端点处的函数值',
      explanation: "f'(x) = 3x² - 3 = 0，得 x = ±1。f(-2) = -2，f(-1) = 2，f(1) = -2，f(2) = 2。最大值为 2（在 x = -1 和 x = 2 处取得）。"
    },
    {
      type: 'choice',
      question: '下列哪个是函数 f(x) = 1/(1-x) 在 x = 0 处的泰勒展开式？',
      options: ['1 + x + x² + x³ + ...', '1 - x + x² - x³ + ...', 'x + x² + x³ + ...', '1 + x + x²/2 + x³/6 + ...'],
      answer: 0,
      explanation: '1/(1-x) = 1 + x + x² + x³ + ...，|x| < 1。这是几何级数，是最基本的幂级数展开之一。'
    },
    {
      type: 'analysis',
      question: '解释格林定理的内容及其物理意义。',
      answer: '格林定理：∮_C Pdx + Qdy = ∬_D (∂Q/∂x - ∂P/∂y) dA，其中 C 是区域 D 的正向边界曲线。物理意义：向量场沿封闭曲线的环量等于该场旋度在曲线所围区域上的二重积分。它将边界上的线积分转化为内部面积分。',
      explanation: '格林定理是多元微积分中的核心定理之一，也是斯托克斯定理的二维形式。'
    },
    {
      type: 'calc',
      question: '求幂级数 ∑(n=0→∞) xⁿ 的收敛半径',
      answer: 1,
      hint: '比值审敛法',
      explanation: 'lim|a_{n+1}/a_n| = lim 1/1 = 1，收敛半径 R = 1。当 |x| < 1 时级数收敛。'
    },
    {
      type: 'choice',
      question: '下列哪个方程是二阶线性齐次微分方程？',
      options: ["y'' + y' + y = 0", "y'' + y = x", "y' + y = 0", "y''² + y = 0"],
      answer: 0,
      explanation: "y'' + y' + y = 0 是二阶线性齐次微分方程，各项均为 y 及其导数的线性组合且右端为 0。"
    },
    {
      type: 'analysis',
      question: '用定积分的定义解释"曲边梯形"的面积计算思想。',
      answer: '曲边梯形的面积计算采用"分割、近似、求和、取极限"的思想：\n1. 分割：将区间 [a,b] 分成 n 个小区间\n2. 近似：在每个小区间上用矩形面积近似曲边梯形面积\n3. 求和：将所有矩形面积相加\n4. 取极限：当 n→∞ 时，和式的极限就是曲边梯形的精确面积\n这就是定积分 ∫_a^b f(x)dx 的定义。',
      explanation: '定积分的本质是"无限细分，累加求和"，是微积分中积分学的基础思想。'
    }
  ]
}

/** 线性代数题库 */
export const LINEAR_ALGEBRA_QUIZZES = {
  basic: [
    {
      type: 'calc',
      question: '计算二阶行列式 |1 2; 3 4| = ?',
      answer: -2,
      hint: '行列式 = ad - bc',
      explanation: '|1 2; 3 4| = 1×4 - 2×3 = 4 - 6 = -2。'
    },
    {
      type: 'choice',
      question: '设 A 为 3×3 矩阵，|A| = 2，则 |2A| = ?',
      options: ['4', '8', '16', '2'],
      answer: 2,
      explanation: '|kA| = kⁿ|A|，n 为矩阵阶数。|2A| = 2³ × 2 = 16。'
    },
    {
      type: 'calc',
      question: '矩阵 A = [1 0; 0 1]（2阶单位矩阵），A³ = ?（填入矩阵的迹，即对角线元素之和）',
      answer: 2,
      hint: '单位矩阵的幂不变',
      explanation: '单位矩阵的任意次幂都是它本身，A³ = I，迹为 1 + 1 = 2。'
    },
    {
      type: 'choice',
      question: '下列哪个矩阵可逆？',
      options: ['[1 0; 0 0]', '[1 2; 2 4]', '[1 0; 0 1]', '[0 0; 0 0]'],
      answer: 2,
      explanation: '[1 0; 0 1] 是单位矩阵，行列式为 1 ≠ 0，故可逆。其余矩阵行列式为 0，不可逆。'
    },
    {
      type: 'calc',
      question: '向量 α = (1,2,3)，β = (4,5,6)，求 α 与 β 的内积（点积）',
      answer: 32,
      hint: '对应分量相乘再相加',
      explanation: 'α·β = 1×4 + 2×5 + 3×6 = 4 + 10 + 18 = 32。'
    },
    {
      type: 'calc',
      question: '解线性方程组：x + y = 3，x - y = 1，求 x 的值',
      answer: 2,
      hint: '两式相加消去 y',
      explanation: '两式相加得 2x = 4，x = 2。代入得 y = 1。'
    },
    {
      type: 'choice',
      question: 'n 阶方阵 A 可逆的充要条件是？',
      options: ['|A| = 0', '|A| ≠ 0', 'A = Aᵀ', 'A 为对角矩阵'],
      answer: 1,
      explanation: '方阵可逆的充要条件是行列式不为 0，此时存在 A⁻¹ 使得 AA⁻¹ = A⁻¹A = I。'
    },
    {
      type: 'calc',
      question: '计算矩阵 [1 2; 3 4] 与 [0 1; 1 0] 的乘积的左上角元素',
      answer: 2,
      hint: '行乘列',
      explanation: '第一行乘第一列：1×0 + 2×1 = 2。矩阵乘法中 (AB)ᵢⱼ = ∑AᵢₖBₖⱼ。'
    },
    {
      type: 'choice',
      question: '若 A 为对称矩阵，则 A 满足：',
      options: ['A = -Aᵀ', 'A = Aᵀ', 'Aᵀ = -A', 'A·A = I'],
      answer: 1,
      explanation: '对称矩阵满足 A = Aᵀ，即矩阵关于主对角线对称。'
    },
    {
      type: 'calc',
      question: '3 阶单位矩阵的迹（对角线元素之和）是多少？',
      answer: 3,
      hint: '迹 = 对角线元素之和',
      explanation: '3 阶单位矩阵 diag(1,1,1) 的迹 = 1+1+1 = 3。'
    }
  ],
  intermediate: [
    {
      type: 'calc',
      question: '设 u = (1,0,-1)，v = (2,1,1)，求 u 与 v 的向量积（叉积）的第一分量',
      answer: 1,
      hint: 'u×v = (u₂v₃-u₃v₂, u₃v₁-u₁v₃, u₁v₂-u₂v₁)',
      explanation: 'u×v 的第一分量 = u₂v₃ - u₃v₂ = 0×1 - (-1)×1 = 1。'
    },
    {
      type: 'choice',
      question: '向量组 α₁=(1,0), α₂=(0,1), α₃=(1,1) 的秩是？',
      options: ['1', '2', '3', '0'],
      answer: 1,
      explanation: 'α₁、α₂ 线性无关，α₃ = α₁ + α₂ 可由它们线性表示。最大无关组含有 2 个向量，故秩为 2。'
    },
    {
      type: 'calc',
      question: '矩阵 A = [2 0; 0 3] 的特征值之积为？',
      answer: 6,
      hint: '特征值之积等于行列式',
      explanation: '对角矩阵的特征值即对角线元素：λ₁=2, λ₂=3，积为 6。特征值之积 = |A| = 2×3 = 6。'
    },
    {
      type: 'choice',
      question: '设 λ 是矩阵 A 的特征值，则 λ² 是下列哪个矩阵的特征值？',
      options: ['A²', '2A', 'Aᵀ', 'A⁻¹'],
      answer: 0,
      explanation: '若 Aα = λα，则 A²α = A(Aα) = A(λα) = λAα = λ²α，故 λ² 是 A² 的特征值。'
    },
    {
      type: 'calc',
      question: '求向量 α = (1,2,2) 的长度（模）',
      answer: 3,
      hint: '||α|| = √(x₁² + x₂² + x₃²)',
      explanation: '||α|| = √(1² + 2² + 2²) = √9 = 3。'
    },
    {
      type: 'choice',
      question: 'n 元齐次线性方程组 Ax = 0 有非零解的充要条件是？',
      options: ['r(A) = n', 'r(A) < n', 'r(A) > n', 'A 可逆'],
      answer: 1,
      explanation: '齐次方程组 Ax = 0 有非零解 ⇔ r(A) < n（未知数个数），即系数矩阵的秩小于未知数个数。'
    },
    {
      type: 'calc',
      question: '设 A 为 2×2 矩阵，若 |A| = 3，则 |A⁻¹| = ?（分数用小数）',
      answer: 0.3333,
      hint: '|A⁻¹| = 1/|A|',
      explanation: '|A⁻¹| = 1/|A| = 1/3 ≈ 0.3333。'
    },
    {
      type: 'choice',
      question: '若向量组 α₁, α₂, α₃ 线性无关，则下列命题正确的是：',
      options: ['α₁ 可由 α₂, α₃ 线性表示', 'α₁, α₂ 线性无关', 'α₁ + α₂ + α₃ = 0', '三个向量共面'],
      answer: 1,
      explanation: '整体线性无关则部分必线性无关。α₁, α₂ 是 α₁, α₂, α₃ 的部分组，必线性无关。'
    },
    {
      type: 'calc',
      question: '设 A 为 2 阶方阵，特征值为 λ₁=2, λ₂=3，则 A 的行列式 |A| = ?',
      answer: 6,
      hint: '特征值之积 = 行列式',
      explanation: '|A| = λ₁ × λ₂ = 2 × 3 = 6。方阵的行列式等于所有特征值的乘积。'
    }
  ],
  advanced: [
    {
      type: 'analysis',
      question: '判断二次型 f(x₁,x₂,x₃) = x₁² + 2x₁x₂ + x₂² + x₃² 是否正定，并说明理由。',
      answer: '该二次型的矩阵为 A = [[1,1,0],[1,1,0],[0,0,1]]。顺序主子式：Δ₁ = 1 > 0，Δ₂ = |1 1; 1 1| = 0，Δ₃ = |A| = 0。因为 Δ₂ = 0，不满足正定的充要条件（所有顺序主子式 > 0），所以不是正定矩阵。实际上它是半正定的。',
      explanation: '判断二次型正定性直接用顺序主子式法。正定要求所有顺序主子式 > 0。'
    },
    {
      type: 'analysis',
      question: '设 A 是 n 阶方阵，证明：若 A² = A（幂等矩阵），则 A 的特征值只能是 0 或 1。',
      answer: '设 λ 是 A 的特征值，α 是对应的特征向量，则 Aα = λα。两边左乘 A 得 A²α = A(λα) = λAα = λ²α。又 A² = A，故 A²α = Aα，即 λ²α = λα，移项得 (λ² - λ)α = 0。由于 α ≠ 0，所以 λ² - λ = 0，解得 λ = 0 或 λ = 1。',
      explanation: '利用特征值的定义和幂等条件直接推导。投影矩阵就是典型的幂等矩阵。'
    },
    {
      type: 'calc',
      question: '在 R³ 中，向量 α = (1,1,0) 在 β = (1,0,0) 上的投影向量的长度是？',
      answer: 1,
      hint: '投影长度 = |α·β| / ||β||',
      explanation: '投影长度 = |α·β| / ||β|| = |1×1 + 1×0 + 0×0| / √(1²+0²+0²) = 1/1 = 1。'
    },
    {
      type: 'choice',
      question: '下列哪个是正交矩阵？',
      options: ['[[1,0],[0,-1]]', '[[1,1],[1,-1]]', '[[1,0],[1,1]]', '[[0,1],[0,1]]'],
      answer: 0,
      explanation: '正交矩阵满足 AᵀA = I。[[1,0],[0,-1]]ᵀ[[1,0],[0,-1]] = [[1,0],[0,1]] = I。且列向量为单位正交向量组。'
    },
    {
      type: 'analysis',
      question: '若 n 阶方阵 A 满足 A² = E（对合矩阵），证明 A 可逆并求 A⁻¹。',
      answer: '由 A² = E，两边取行列式得 |A|² = |E| = 1，故 |A| = ±1 ≠ 0，所以 A 可逆。又 A² = E 即 A·A = E，由逆矩阵定义可知 A⁻¹ = A。',
      explanation: '对合矩阵的逆就是它本身。这种矩阵在对称变换中有重要应用。'
    },
    {
      type: 'calc',
      question: '设 A 为 n 阶方阵，且 A² - 3A + 2I = 0，则 A 的一个特征值可能是？',
      answer: 1,
      hint: '特征多项式代入',
      explanation: '设 λ 为特征值，则 λ² - 3λ + 2 = 0，解得 λ = 1 或 λ = 2。'
    },
    {
      type: 'choice',
      question: '将二次型 f = x₁² + 2x₁x₂ + x₂² 化为标准型，其正惯性指数为？',
      options: ['0', '1', '2', '3'],
      answer: 1,
      explanation: 'f = (x₁ + x₂)²，标准型为 y₁²，正惯性指数为 1，负惯性指数为 0，符号差为 1。'
    },
    {
      type: 'analysis',
      question: '证明：若 A 是正交矩阵，则 A 的行列式 |A| = ±1。',
      answer: '正交矩阵满足 AᵀA = I。两边取行列式：|AᵀA| = |I|，即 |Aᵀ|·|A| = 1。由于 |Aᵀ| = |A|，故 |A|² = 1，因此 |A| = ±1。',
      explanation: '正交矩阵的行列式为 ±1，其中行列式为 +1 的称为旋转（proper），为 -1 的称为反射（improper）。'
    }
  ]
}

/** 考研英语题库 */
export const ENGLISH_POSTGRADUATE_QUIZZES = {
  basic: [
    {
      type: 'choice',
      question: 'The word "phenomenon" refers to:',
      options: ['a person who is famous', 'a fact or event that can be observed', 'a type of medicine', 'a scientific theory'],
      answer: 1,
      explanation: '"phenomenon" 意为"现象"，指可观察的事实或事件，复数形式为 "phenomena"。'
    },
    {
      type: 'fill',
      question: 'The past participle of "undertake" is ___.',
      answer: 'undertaken',
      hint: '不规则动词，常见考研词汇',
      explanation: 'undertake → undertook → undertaken，意为"承担、从事"。这是一个考研高频不规则动词。'
    },
    {
      type: 'choice',
      question: 'Choose the correct sentence:',
      options: [
        'He is looking forward to meet you.',
        'He is looking forward to meeting you.',
        'He looks forward to meet you.',
        'He looked forward meet you.'
      ],
      answer: 1,
      explanation: 'look forward to 中的 to 是介词，后面接动名词（-ing形式）。'
    },
    {
      type: 'fill',
      question: '"__________(鉴于) the complexity of the issue, further discussion is needed." (填一个词)',
      answer: 'Given',
      hint: '介词，表示"考虑到"',
      explanation: '"Given" 在此作介词，意为"鉴于、考虑到"，后面跟名词短语。'
    },
    {
      type: 'choice',
      question: 'Which word means "to make something less severe or serious"?',
      options: ['aggravate', 'alleviate', 'allocate', 'appreciate'],
      answer: 1,
      explanation: 'alleviate 意为"减轻、缓解"。aggravate 是"加重"，allocate 是"分配"，appreciate 是"感激/欣赏"。'
    },
    {
      type: 'fill',
      question: 'The opposite of "permanent" is ______.',
      answer: 'temporary',
      hint: '反义词，以 temp- 开头',
      explanation: 'permanent（永久的）的反义词是 temporary（暂时的）。'
    },
    {
      type: 'choice',
      question: '"The report is based on ___ data collected from various sources."',
      options: ['a', 'an', 'the', '不填'],
      answer: 2,
      explanation: 'data 在这里是特指"从各种来源收集来的数据"，所以用定冠词 the。'
    },
    {
      type: 'choice',
      question: 'Which word means "able to adapt to many different functions"?',
      options: ['versatile', 'vulnerable', 'vigorous', 'volatile'],
      answer: 0,
      explanation: 'versatile 意为"多功能的、多才多艺的"。vulnerable 是"脆弱的"，vigorous 是"有力的"，volatile 是"不稳定的"。'
    },
    {
      type: 'fill',
      question: '"The company decided to ______(实施) a new marketing strategy." (填动词原形)',
      answer: 'implement',
      hint: '以 im- 开头，意为"实施"',
      explanation: 'implement 意为"实施、执行"，是考研英语中的高频动词。'
    },
    {
      type: 'choice',
      question: '"He is ___ of passing the exam." (able/capable)',
      options: ['able', 'capable', 'both', 'neither'],
      answer: 1,
      explanation: '固定搭配：be capable of doing / be able to do。所以此处应填 capable。'
    }
  ],
  intermediate: [
    {
      type: 'choice',
      question: 'Translate: "This phenomenon has attracted considerable attention from researchers."',
      options: [
        '这种现象已经吸引了研究人员的相当关注。',
        '这个名人受到了研究者的注意。',
        '这个现象被研究者忽略了。',
        '研究人员对这个奇迹感到惊讶。'
      ],
      answer: 0,
      explanation: 'phenomenon = 现象，attracted considerable attention = 吸引了相当关注，researchers = 研究人员。'
    },
    {
      type: 'fill',
      question: '"The government ________(颁布) new regulations to address the issue." (过去式)',
      answer: 'enacted',
      hint: '以 en- 开头，意为"制定/颁布"',
      explanation: 'enact 意为"颁布、制定（法律、法规）"。enacted 是过去式。'
    },
    {
      type: 'choice',
      question: 'What does "the former" refer to in "Between AI and human intelligence, the former is more efficient in data processing"?',
      options: ['Human intelligence', 'AI', 'Data processing', 'Efficiency'],
      answer: 1,
      explanation: '"the former" 指代前文提到的第一个事物。前文先提 AI 再提 human intelligence，所以 the former = AI。'
    },
    {
      type: 'fill',
      question: '"Not only ___ he finish the project, but he also exceeded expectations." (填助动词)',
      answer: 'did',
      hint: '"Not only" 放句首需要倒装',
      explanation: '"Not only" 放句首时，主句需要部分倒装。原句是过去时，所以用 did 提前：Not only did he finish...'
    },
    {
      type: 'choice',
      question: 'The word "paradigm" in academic writing most nearly means:',
      options: ['a type of payment', 'a typical example or pattern', 'a geometric shape', 'a type of medicine'],
      answer: 1,
      explanation: '"paradigm" 在学术写作中意为"范式、典范"，指一个典型的例子或思维模式。"paradigm shift" = 范式转变。'
    },
    {
      type: 'choice',
      question: 'Analyze the sentence structure: "The fact that she succeeded surprised everyone." The clause "that she succeeded" is:',
      options: ['an adverbial clause', 'an attributive clause modifying "fact"', 'a subject clause', 'an object clause'],
      answer: 1,
      explanation: '"that she succeeded" 是同位语从句（属于名词性从句），修饰名词 "fact"，说明 fact 的具体内容。'
    },
    {
      type: 'fill',
      question: '"The professor insisted that the student ___(submit) the paper before Friday." (填动词原形)',
      answer: 'submit',
      hint: 'insist 后接虚拟语气，动词用原形',
      explanation: 'insist（坚持要求）后的 that 从句要用虚拟语气：should + 动词原形，should 可省略。故填 submit。'
    },
    {
      type: 'choice',
      question: '"The number of students ___ increasing, while a number of issues ___ yet to be solved."',
      options: ['is/are', 'are/is', 'is/is', 'are/are'],
      answer: 0,
      explanation: '"the number of" 作主语用单数，"a number of" 作主语用复数。这是考研英语语法高频考点。'
    },
    {
      type: 'fill',
      question: '"The new policy will ______(生效) next month." (填一个短语: take ___)',
      answer: 'take effect',
      hint: '固定短语，意为"生效"',
      explanation: 'take effect 意为"生效、起作用"。类似短语：take place（发生），take part in（参与）。'
    },
    {
      type: 'choice',
      question: 'Select the correct translation: "The significance of this discovery cannot be overemphasized."',
      options: ['这个发现的重要性不能被过分强调', '这个发现的重要性再怎么强调也不为过', '这个发现毫无意义', '这个发现被过度强调了'],
      answer: 1,
      explanation: '"cannot be overemphasized" 是否定+超过，意为"再怎么强调也不为过"，是考研英语翻译的常见考点。'
    }
  ],
  advanced: [
    {
      type: 'analysis',
      question: 'Analyze this sentence: "The notion that learning should be focused on nurturing the ability to think critically, rather than merely memorizing facts, has gained increasing recognition among educators worldwide." 请翻译并分析句子结构。',
      answer: '翻译："学习应侧重于培养批判性思维能力，而非仅仅记忆事实——这一理念已获得全球教育工作者越来越多的认可。"\n句子结构分析：主语是 The notion，后接 that 引导的同位语从句。同位语从句中：主语 learning，谓语 should be focused on，宾语 nurturing the ability，to think critically 是不定式作定语。rather than... 是比较状语。主句谓语 has gained，宾语 increasing recognition。',
      explanation: '这是考研英语典型的长难句：主语 + 同位语从句（含比较结构）+ 谓语 + 宾语。'
    },
    {
      type: 'analysis',
      question: 'Compare and contrast "however", "nevertheless", and "nonetheless" in academic writing usage.',
      answer: '三个词都有"然而、不过"的意思，但在使用中有细微差别：\n1. However：最常用，可放在句首、句中或句尾，表示与前面内容转折，语气相对温和。\n2. Nevertheless：语气更强，强调"尽管前面所说，但仍然..."。\n3. Nonetheless：与 nevertheless 基本同义，但更正式，使用频率略低。',
      explanation: '掌握近义词的细微差别是考研英语写作高分的关键。'
    },
    {
      type: 'choice',
      question: 'In academic writing, which phrase is most appropriate for introducing a counterargument?',
      options: ['But I think', 'Critics may argue that', 'Anyway,', 'As you know'],
      answer: 1,
      explanation: '"Critics may argue that" 是学术写作中引出反方观点最正式、恰当的表达。'
    },
    {
      type: 'analysis',
      question: 'Translate and analyze: "While it is true that technological advancement has brought unprecedented convenience to our daily lives, the extent to which it has encroached upon personal privacy should not be underestimated."',
      answer: '翻译："虽然技术进步确实给我们的日常生活带来了前所未有的便利，但它对个人隐私的侵蚀程度也不应被低估。"\n结构分析：While 引导让步状语从句，从句中 it 是形式主语，that 从句是真正主语。主句中 the extent 是主语，to which... 是定语从句，should not be underestimated 是谓语（被动语态）。',
      explanation: 'While it is true that...（虽然确实...）是考研英语写作中常用的让步句式。'
    },
    {
      type: 'analysis',
      question: 'Analyze the difference between "argue", "debate", and "discuss" in academic writing.',
      answer: 'argue（论证）：提出理由支持或反对某观点，语气最强，强调说服对方。\ndebate（辩论）：双方就某一问题正式辩论，通常有对立观点。\ndiscuss（讨论）：就某一问题交换意见，语气最温和，不强调对立。\n\n在学术写作中：\n- This paper argues that...（本文论证...）\n- Scholars have debated whether...（学者们一直在争论是否...）\n- This section discusses...（本节讨论...）',
      explanation: '掌握这些近义词的语义层次有助于学术写作的精确表达。'
    },
    {
      type: 'choice',
      question: '"By no means ___ this behavior acceptable in academic settings." Choose the correct inversion.',
      options: ['is', 'are', 'does', 'has'],
      answer: 0,
      explanation: '"By no means" 放句首需要部分倒装。主语 "this behavior" 是单数，所以用 is。原句：This behavior is by no means acceptable...'
    }
  ]
}

/* ======================== 四级英语题库 ======================== */
export const CET4_ENGLISH_QUIZZES = {
  basic: [
    {
      type: 'choice',
      question: '"The movie was ___ interesting that I watched it twice."',
      options: ['so', 'such', 'too', 'very'],
      answer: 0,
      explanation: '"so...that" 是固定句型，意为"如此...以至于"。so 后接形容词/副词，such 后接名词。'
    },
    {
      type: 'fill',
      question: '"I\'m looking forward to ______(hear) from you soon." (填正确形式)',
      answer: 'hearing',
      hint: '介词 to 后接动名词',
      explanation: 'look forward to 中的 to 是介词，后面要接动名词（-ing形式）。'
    },
    {
      type: 'choice',
      question: 'What does "abandon" mean?',
      options: ['接受', '放弃', '到达', '吸收'],
      answer: 1,
      explanation: 'abandon 意为"放弃、抛弃"，是四级高频词汇。'
    },
    {
      type: 'choice',
      question: '"The teacher asked us to ___ the text carefully."',
      options: ['look after', 'look into', 'look through', 'look up'],
      answer: 2,
      explanation: 'look through 意为"浏览、仔细查看"。look after = 照顾，look into = 调查，look up = 查询。'
    },
    {
      type: 'fill',
      question: '"He is very _____(experience) in teaching English." (填形容词形式)',
      answer: 'experienced',
      hint: '动词加 -ed 变形容词',
      explanation: 'experience 的形容词形式是 experienced，意为"有经验的"。'
    },
    {
      type: 'choice',
      question: '"Would you like ___ coffee?"',
      options: ['some', 'any', 'a few', 'many'],
      answer: 0,
      explanation: '在表示邀请或请求的疑问句中，通常用 some 而非 any。'
    },
    {
      type: 'choice',
      question: 'Which word means "to make something better"?',
      options: ['improve', 'imply', 'import', 'impose'],
      answer: 0,
      explanation: 'improve 意为"改善、提高"。imply = 暗示，import = 进口，impose = 强加。'
    },
    {
      type: 'fill',
      question: '"The _____(long) of the river is about 500 kilometers." (填名词形式)',
      answer: 'length',
      hint: '形容词变名词',
      explanation: 'long 的名词形式是 length，意为"长度"。'
    },
    {
      type: 'choice',
      question: '"I have ___ finished my homework."',
      options: ['just', 'yet', 'already', 'still'],
      answer: 0,
      explanation: 'just 用于现在完成时，意为"刚刚"。yet 用于否定/疑问，already 用于肯定句。'
    }
  ],
  intermediate: [
    {
      type: 'choice',
      question: '"With the ___ of technology, our lives have become more convenient."',
      options: ['development', 'invention', 'discovery', 'creation'],
      answer: 0,
      explanation: '"with the development of" 是固定搭配，意为"随着...的发展"。'
    },
    {
      type: 'fill',
      question: '"It is high time that the government ___ (take) effective measures to protect the environment." (填正确形式)',
      answer: 'took',
      hint: '"It is high time that" 后用虚拟语气（过去式）',
      explanation: '"It is high time that" 从句要用虚拟语气，动词用过去式，故填 took。'
    },
    {
      type: 'choice',
      question: '"She is ___ to win the competition."',
      options: ['like', 'alike', 'likely', 'likelihood'],
      answer: 2,
      explanation: 'be likely to do 意为"很可能做某事"，likely 是形容词。'
    },
    {
      type: 'choice',
      question: 'What does "contribute to" mean in "Exercise contributes to good health"?',
      options: ['捐款给', '导致（负面）', '有助于', '贡献出'],
      answer: 2,
      explanation: 'contribute to 意为"有助于、促成"（正面含义），这里是"锻炼有助于健康"。'
    },
    {
      type: 'fill',
      question: '"The ___ (pollute) of the air has become a serious problem." (填名词形式)',
      answer: 'pollution',
      hint: '动词变名词',
      explanation: 'pollute 的名词形式是 pollution，意为"污染"。'
    },
    {
      type: 'choice',
      question: '"Neither the teacher nor the students ___ satisfied with the result."',
      options: ['is', 'are', 'was', 'has been'],
      answer: 1,
      explanation: '"neither...nor" 遵循就近一致原则，后接的名词 students 是复数，故用 are。'
    },
    {
      type: 'choice',
      question: '"This book is ___ reading."',
      options: ['worth', 'worthy', 'worthwhile', 'valuable'],
      answer: 0,
      explanation: 'be worth doing 是固定搭配，意为"值得做"。worthy 需接 of，worthwhile 常用 it is worthwhile to do。'
    },
    {
      type: 'fill',
      question: '"The manager insisted that the meeting ___ (hold) on time." (填正确形式)',
      answer: 'be held',
      hint: 'insist that 从句用虚拟语气，且为被动',
      explanation: 'insist that 从句用 (should) + 动词原形，且 meeting 与 hold 是被动关系，故填 (should) be held。'
    },
    {
      type: 'choice',
      question: '"___ his homework, he went out to play."',
      options: ['Finishing', 'Having finished', 'To finish', 'Being finished'],
      answer: 1,
      explanation: '"Having finished" 是现在分词的完成式作状语，表示"完成作业之后"。强调先于主句动词发生的动作。'
    }
  ],
  advanced: [
    {
      type: 'choice',
      question: '"It was not until he arrived at the station ___ he realized he had left his ticket at home."',
      options: ['when', 'that', 'where', 'then'],
      answer: 1,
      explanation: '"It was not until...that..." 是强调句型，意为"直到...才..."。这是四级考试高频考点。'
    },
    {
      type: 'fill',
      question: '"Only after the accident ___ he realize the importance of safety." (填倒装部分)',
      answer: 'did',
      hint: '"Only + 状语"放句首要倒装',
      explanation: '"Only + 状语"放句首，主句需要部分倒装。原句应为：he did realize → did he realize。'
    },
    {
      type: 'choice',
      question: '"The problem is ___ complicated than we expected."',
      options: ['more', 'much more', 'far more', 'all of the above'],
      answer: 3,
      explanation: '比较级前可用 much, far, even, a lot 等词修饰加强语气，它们都可以。'
    },
    {
      type: 'choice',
      question: 'What does "in terms of" mean in "In terms of quality, this product is excellent"?',
      options: ['在...期间', '就...而言', '以...为代价', '在...方面'],
      answer: 1,
      explanation: 'in terms of 意为"就...而言、在...方面"，是四级写作和翻译的高频表达。'
    },
    {
      type: 'fill',
      question: '"She would rather ___ (stay) at home than go out on such a rainy day." (填正确形式)',
      answer: 'stay',
      hint: 'would rather 后接动词原形',
      explanation: '"would rather do than do" 是固定搭配，后接动词原形，故填 stay。'
    },
    {
      type: 'analysis',
      question: 'Translate the sentence: "With the rapid development of the Internet, an increasing number of people choose to shop online rather than in traditional stores."',
      answer: '"随着互联网的快速发展，越来越多的人选择在网上购物，而不是在传统商店里。"',
      explanation: 'with + 名词短语作伴随状语，an increasing number of = 越来越多的，rather than = 而不是。'
    },
    {
      type: 'choice',
      question: '"The experiment ___ out to be a great success."',
      options: ['turned', 'takes', 'carried', 'worked'],
      answer: 0,
      explanation: 'turn out 意为"结果是、证明是"。turn out to be = 结果是。'
    },
    {
      type: 'fill',
      question: '"There is no ___ (deny) that education plays a crucial role in personal development." (填正确形式)',
      answer: 'denying',
      hint: '"There is no + 动名词" 固定句型',
      explanation: '"There is no + doing" 是固定句型，意为"不可能...、无法..."，故填 denying。'
    },
    {
      type: 'choice',
      question: '"___ from the top of the mountain, the city looks magnificent."',
      options: ['Seeing', 'Seen', 'To see', 'Having seen'],
      answer: 1,
      explanation: '动词的过去分词作状语表示被动。the city 与 see 之间是被动关系（"被看见"），故用 Seen。'
    }
  ]
}

/* ======================== 六级英语题库 ======================== */
export const CET6_ENGLISH_QUIZZES = {
  basic: [
    {
      type: 'choice',
      question: '"The word "ambiguity" most nearly means:"',
      options: ['清晰明确', '模棱两可', '愤怒不满', '漠不关心'],
      answer: 1,
      explanation: 'ambiguity 意为"歧义、模棱两可"，是阅读理解中常见的高频词汇。'
    },
    {
      type: 'fill',
      question: '"The two countries have established a ________(合作) relationship." (填名词)',
      answer: 'cooperative',
      hint: 'co- 开头，意为"合作的"',
      explanation: 'cooperative 是形容词，意为"合作的"。co- 前缀表示"共同"。'
    },
    {
      type: 'choice',
      question: '"He is ___ of winning the scholarship."',
      options: ['confident', 'confidential', 'confined', 'confirmed'],
      answer: 0,
      explanation: 'be confident of 意为"对...有信心"。confidential = 机密的，confined = 受限的，confirmed = 确认的。'
    },
    {
      type: 'choice',
      question: '"The ___ effect of the drug is still unknown."',
      options: ['side', 'sight', 'sigh', 'sign'],
      answer: 0,
      explanation: 'side effect 是固定搭配，意为"副作用"。这是六级高频医学/科技词汇。'
    },
    {
      type: 'fill',
      question: '"The research findings ______(验证) our hypothesis." (填动词原形)',
      answer: 'validate',
      hint: '以 val- 开头，意为"验证"',
      explanation: 'validate 意为"验证、证实"。research findings 是复数，所以动词用原形 validate。'
    },
    {
      type: 'choice',
      question: '"The company is trying to ___ its market share."',
      options: ['expand', 'expend', 'expose', 'exploit'],
      answer: 0,
      explanation: 'expand 意为"扩展、扩大"。expend = 花费，expose = 暴露，exploit = 利用/剥削。'
    },
    {
      type: 'choice',
      question: '"The word "inevitable" means:"',
      options: ['不可避免的', '不可靠的', '不可思议的', '不可分割的'],
      answer: 0,
      explanation: 'inevitable 意为"不可避免的"，由 in-（不）+ evitable（可避免的）构成。'
    },
    {
      type: 'fill',
      question: '"The weather is highly _______(可变的) in this region." (填形容词)',
      answer: 'variable',
      hint: '以 var- 开头',
      explanation: 'variable 意为"可变的、多变的"。vary（动词：变化）→ variable（形容词）。'
    },
    {
      type: 'choice',
      question: '"She gave a ___ account of what had happened."',
      options: ['detail', 'detailed', 'detailing', 'details'],
      answer: 1,
      explanation: 'detailed 是形容词，意为"详细的"。a detailed account = 详细的描述。'
    }
  ],
  intermediate: [
    {
      type: 'choice',
      question: '"The government should take ___ to prevent pollution."',
      options: ['steps', 'stops', 'stocks', 'stakes'],
      answer: 0,
      explanation: 'take steps to do 是固定搭配，意为"采取措施做某事"。take measures 也有类似含义。'
    },
    {
      type: 'fill',
      question: '"There has been a significant ______(增加) in the number of Internet users." (填名词)',
      answer: 'increase',
      hint: 'in- 前缀，意为"增加"',
      explanation: 'a significant increase in 意为"在...方面显著增长"。increase 既可作动词也可作名词。'
    },
    {
      type: 'choice',
      question: '"___ the difficulty, she managed to finish the task on time."',
      options: ['Despite', 'Although', 'Because of', 'Regardless'],
      answer: 0,
      explanation: 'Despite = 尽管，后接名词/动名词。Although 后接从句。Regardless 后需接 of。'
    },
    {
      type: 'choice',
      question: '"The two theories are ___ in many ways."',
      options: ['distinct', 'distinctive', 'distinguished', 'distinguishable'],
      answer: 0,
      explanation: 'distinct 意为"不同的、有区别的"。distinctive = 有特色的，distinguished = 著名的，distinguishable = 可区分的。'
    },
    {
      type: 'fill',
      question: '"The new policy aims to ______(消除) poverty in rural areas." (填动词)',
      answer: 'eliminate',
      hint: '以 e- 开头，意为"消除"',
      explanation: 'eliminate 意为"消除、根除"。aim to eliminate poverty = 旨在消除贫困。'
    },
    {
      type: 'choice',
      question: 'Which sentence uses subjunctive mood correctly?',
      options: [
        'I wish I am a bird.',
        'I wish I were a bird.',
        'I wish I was a bird.',
        'I wish I be a bird.'
      ],
      answer: 1,
      explanation: 'wish 后的 that 从句用虚拟语气，be 动词统一用 were（不用 was），所以 "I wish I were..." 正确。'
    },
    {
      type: 'choice',
      question: '"The article ___ a number of important issues."',
      options: ['addresses', 'adresses', 'adds', 'adopts'],
      answer: 0,
      explanation: 'address 作动词可表示"处理、应对（问题）"。address issues = 处理问题。注意拼写：双 d 单 ss。'
    },
    {
      type: 'fill',
      question: '"The agreement is _______(强制的) for all members." (填形容词)',
      answer: 'mandatory',
      hint: '以 man- 开头，意为"强制性的"',
      explanation: 'mandatory 意为"强制性的、必须的"。同义词有 compulsory, obligatory。'
    },
    {
      type: 'choice',
      question: '"Her research ___ new light on the causes of the disease."',
      options: ['sheds', 'shelters', 'shifts', 'shoots'],
      answer: 0,
      explanation: 'shed light on 是固定搭配，意为"阐明、使...清楚"。sheds 是第三人称单数。'
    }
  ],
  advanced: [
    {
      type: 'analysis',
      question: 'Translate and analyze: "Despite the fact that the global economy has shown signs of recovery, the underlying structural problems that precipitated the crisis remain unresolved."',
      answer: '翻译："尽管全球经济已显示出复苏迹象，但引发危机的根本结构性问题仍未解决。"\n结构分析：Despite the fact that... 是让步状语，that the global economy... 是同位语从句修饰 fact。主句主语 the underlying structural problems，后接 that 定语从句修饰，谓语 remain unresolved。',
      explanation: '六级阅读典型长难句分析。despite the fact that = 尽管，underlying = 根本的，precipitate = 引发。'
    },
    {
      type: 'choice',
      question: '"The findings of this study ___ the previous research in this field."',
      options: ['collaborate', 'corroborate', 'correlate', 'cooperate'],
      answer: 1,
      explanation: 'corroborate 意为"证实、支持（发现、理论等）"。collaborate = 合作，correlate = 相关，cooperate = 合作。'
    },
    {
      type: 'fill',
      question: '"The scientist\'s theory was met with widespread _____(怀疑)." (填名词)',
      answer: 'skepticism',
      hint: '以 s- 开头，意为"怀疑态度"',
      explanation: 'skepticism 意为"怀疑态度"。be met with skepticism = 遭到怀疑。'
    },
    {
      type: 'choice',
      question: '"The _____ of the research methodology has been questioned by many scholars."',
      options: ['validation', 'validity', 'valid', 'validate'],
      answer: 1,
      explanation: 'validity 是名词，意为"有效性、可信度"。这里需要名词作主语，表示"研究方法论的有效性"。'
    },
    {
      type: 'choice',
      question: '"It is ___ that the company will go bankrupt if it does not restructure."',
      options: ['transparent', 'tangible', 'imminent', 'immune'],
      answer: 2,
      explanation: 'imminent 意为"即将发生的、迫在眉睫的"。这里指公司破产"迫在眉睫"。'
    },
    {
      type: 'fill',
      question: '"The two phenomena are closely ______(相关联的)." (填形容词，以 inter- 开头)',
      answer: 'interrelated',
      hint: 'inter- 前缀，意为"相互关联的"',
      explanation: 'interrelated 意为"相互关联的"。inter- 表示"相互"，related = 相关的。'
    },
    {
      type: 'analysis',
      question: 'Translate and comment: "The proliferation of social media platforms has fundamentally altered the landscape of interpersonal communication, blurring the boundaries between public and private discourse."',
      answer: '翻译："社交媒体平台的激增从根本上改变了人际沟通的格局，模糊了公共话语与私人话语之间的界限。"\n关键词汇：proliferation = 激增/扩散，fundamentally = 根本上，alter = 改变，landscape = 格局，blurring boundaries = 模糊界限，discourse = 话语。',
      explanation: '六级的学术词汇要求：proliferation, fundamentally, discourse 都是高级词汇。blurring 是现在分词作结果状语。'
    },
    {
      type: 'choice',
      question: '"The reform is ___ to improving the efficiency of the entire system."',
      options: ['indispensable', 'indisputable', 'indistinguishable', 'independent'],
      answer: 0,
      explanation: 'be indispensable to 意为"对...不可或缺"。indisputable = 无可争议的，indistinguishable = 难以区分的。'
    },
    {
      type: 'fill',
      question: '"The program is designed to ______(培养) creativity and critical thinking in students." (填动词)',
      answer: 'foster',
      hint: '以 f- 开头，意为"培养"',
      explanation: 'foster 意为"培养、促进"。同义词：cultivate, nurture, promote。'
    }
  ]
}

/* ======================== 数据结构题库 ======================== */
export const DATA_STRUCTURE_QUIZZES = {
  basic: [
    {
      type: 'choice',
      question: '栈（Stack）的特点是：',
      options: ['先进先出（FIFO）', '先进后出（FILO）', '随机访问', '双端进出'],
      answer: 1,
      explanation: '栈是一种先进后出（FILO）的线性表，只能在栈顶进行插入和删除操作。'
    },
    {
      type: 'choice',
      question: '在单链表中，插入一个新节点的时间复杂度是（已知插入位置的前驱节点）：',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
      answer: 0,
      explanation: '已知前驱节点时，单链表插入只需修改指针，时间复杂度为 O(1)。'
    },
    {
      type: 'calc',
      question: '一个完全二叉树有 6 层（根为第 1 层），最多有多少个节点？',
      answer: 63,
      hint: '满二叉树公式',
      explanation: '前 6 层满二叉树最多有 2⁶ - 1 = 63 个节点。'
    },
    {
      type: 'choice',
      question: '队列（Queue）的入队和出队操作分别发生在：',
      options: ['两端分别进行', '同一端进行', '都在队头', '都在队尾'],
      answer: 0,
      explanation: '队列在一端（队尾）入队，另一端（队头）出队，遵循先进先出（FIFO）原则。'
    },
    {
      type: 'choice',
      question: '哈希表查找的平均时间复杂度是（假设冲突较少）：',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
      answer: 0,
      explanation: '哈希表通过哈希函数直接定位，理想情况下平均查找时间复杂度为 O(1)。'
    },
    {
      type: 'choice',
      question: '二叉树的先序遍历顺序是：',
      options: ['根-左-右', '左-根-右', '左-右-根', '根-右-左'],
      answer: 0,
      explanation: '先序遍历：先访问根节点，再遍历左子树，最后遍历右子树，即根-左-右。'
    },
    {
      type: 'calc',
      question: '一个长度为 7 的数组进行冒泡排序，最坏情况下需要比较多少次？',
      answer: 21,
      hint: '冒泡排序最坏情况比较次数',
      explanation: '冒泡排序最坏情况比较次数 = n(n-1)/2 = 7×6/2 = 21。'
    },
    {
      type: 'choice',
      question: '以下哪种数据结构常用于实现函数的递归调用？',
      options: ['队列', '栈', '树', '图'],
      answer: 1,
      explanation: '递归调用使用系统栈来保存每次调用的返回地址和局部变量，遵循后进先出（LIFO）原则。'
    },
    {
      type: 'choice',
      question: '单链表不具备的特点是：',
      options: ['插入和删除方便', '随机访问方便', '存储空间动态分配', '不需要连续内存'],
      answer: 1,
      explanation: '单链表不支持随机访问，查找第 i 个元素需要从头遍历，时间复杂度 O(n)。'
    },
    {
      type: 'calc',
      question: '一个深度为 4 的完全二叉树（根深度为 1），最少有多少个节点？',
      answer: 8,
      hint: '前 3 层满，第 4 层至少 1 个',
      explanation: '前 3 层满有 1+2+4=7 个节点，第 4 层至少 1 个节点，共 8 个。完全二叉树中除最后一层外都是满的。'
    }
  ],
  intermediate: [
    {
      type: 'choice',
      question: '对长度为 n 的有序数组进行二分查找，最坏情况下的时间复杂度为：',
      options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(n²)'],
      answer: 1,
      explanation: '二分查找每次将查找范围缩小一半，最坏情况下需 log₂(n) 次比较，时间复杂度 O(log n)。'
    },
    {
      type: 'calc',
      question: '已知一个图的顶点数为 5，边数为 7，则该图所有顶点的度数之和为？',
      answer: 14,
      hint: '握手定理',
      explanation: '握手定理：图中所有顶点的度数之和等于边数的两倍。2 × 7 = 14。'
    },
    {
      type: 'choice',
      question: '下列哪种排序算法在最坏情况下时间复杂度为 O(n²)？',
      options: ['归并排序', '快速排序', '堆排序', '计数排序'],
      answer: 1,
      explanation: '快速排序在最坏情况下（如数组已经有序）时间复杂度为 O(n²)，但平均为 O(n log n)。'
    },
    {
      type: 'choice',
      question: '中序遍历二叉搜索树得到的是：',
      options: ['递增序列', '递减序列', '无序序列', '先增后减序列'],
      answer: 0,
      explanation: '二叉搜索树的中序遍历得到递增有序序列，这是 BST 的重要性质。'
    },
    {
      type: 'calc',
      question: '一个 3 阶 B-树，根节点至少需要有几个关键字？',
      answer: 1,
      hint: 'B-树根节点关键字数下限',
      explanation: '3 阶 B-树的阶数为 3，根节点至少有 1 个关键字（除非为空），其他节点至少有 ⌈3/2⌉-1 = 1 个关键字。'
    },
    {
      type: 'choice',
      question: '图的深度优先遍历（DFS）使用的数据结构是：',
      options: ['队列', '栈', '数组', '链表'],
      answer: 1,
      explanation: 'DFS 使用栈（或递归，递归本质上也是栈）来实现回溯，BFS 使用队列。'
    },
    {
      type: 'fill',
      question: '已知一颗二叉树的中序遍历为 DBEAC，后序遍历为 DEBCA，其前序遍历为______。',
      answer: 'ABDEC',
      hint: '后序最后一个节点是根',
      explanation: '后序 DEBCA 中 A 是根，中序 DBE 在 A 左边是左子树，C 在右边是右子树。递归可得前序 ABDEC。'
    },
    {
      type: 'choice',
      question: '快速排序在平均情况下的时间复杂度是：',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
      answer: 1,
      explanation: '快速排序平均时间复杂度 O(n log n)，最坏 O(n²)（已有序时），最好 O(n log n)。'
    },
    {
      type: 'calc',
      question: '一个二叉树有 10 个节点，其中 5 个叶子节点，则度为 2 的节点有多少个？',
      answer: 4,
      hint: '二叉树中 n₀ = n₂ + 1',
      explanation: '由二叉树性质：n₀ = n₂ + 1（叶子数 = 度为2的节点数 + 1）。n₀ = 5，则 n₂ = 4。又度为1的节点 n₁ = 10 - 5 - 4 = 1。'
    },
    {
      type: 'choice',
      question: '在哈希表中，装填因子 α 越大，则：',
      options: ['查找效率越高', '冲突概率越大', '空间利用率越低', '删除越快'],
      answer: 1,
      explanation: '装填因子 α = 表中记录数 / 哈希表长度。α 越大，表越满，冲突概率越大，查找效率越低。通常控制 α 在 0.7~0.8 左右。'
    }
  ],
  advanced: [
    {
      type: 'analysis',
      question: '比较顺序表和链表的优缺点及适用场景。',
      answer: '顺序表：内存连续，支持随机访问 O(1)，插入/删除需移动元素 O(n)。适用于频繁查找、少量插入删除的场景。\n链表：内存不连续，不支持随机访问 O(n)，插入/删除只需修改指针 O(1)。适用于频繁插入删除、不确定数据量的场景。',
      explanation: '选择顺序表还是链表的核心权衡：访问频率 vs 修改频率。'
    },
    {
      type: 'choice',
      question: '哈希冲突的解决方式中，下列哪种属于开放地址法？',
      options: ['链地址法', '线性探测法', '再哈希法', '建立公共溢出区'],
      answer: 1,
      explanation: '线性探测法是开放地址法的一种，当冲突发生时，依次探测下一个空闲位置。'
    },
    {
      type: 'analysis',
      question: '简述 Dijkstra 算法求单源最短路径的基本思路。',
      answer: 'Dijkstra 算法步骤：\n1. 初始化 dist[s]=0，其他 dist=∞。\n2. 每次从未访问的节点中选择 dist 最小的节点 u。\n3. 标记 u 为已访问，更新 u 的所有邻接节点 v 的 dist：dist[v] = min(dist[v], dist[u] + w(u,v))。\n4. 重复步骤 2-3 直到所有节点被访问。\n要求图中不能有负权边。',
      explanation: 'Dijkstra 算法是贪心算法的典型应用，每次选择当前最短路径的节点进行松弛。'
    },
    {
      type: 'calc',
      question: '一个 10 个顶点的无向完全图有多少条边？',
      answer: 45,
      hint: '无向完全图边数 = n(n-1)/2',
      explanation: '无向完全图边数 = n(n-1)/2 = 10×9/2 = 45。'
    },
    {
      type: 'choice',
      question: '平衡二叉树（AVL）中，任意节点的左右子树高度差绝对值不超过：',
      options: ['0', '1', '2', '3'],
      answer: 1,
      explanation: 'AVL 树要求任意节点的平衡因子（左子树高度 - 右子树高度）的绝对值不超过 1。'
    },
    {
      type: 'analysis',
      question: '简述 Prim 算法和 Kruskal 算法求最小生成树的区别。',
      answer: 'Prim 算法：从任意顶点开始，每次选择连接已在树中顶点和不在树中顶点的最短边，适合稠密图。时间复杂度 O(V²)。\nKruskal 算法：将所有边按权值从小到大排序，每次选择最短且不形成环的边，适合稀疏图。时间复杂度 O(E log E)。',
      explanation: '两者都是贪心算法。Prim 以顶点为中心扩展，Kruskal 以边为中心选择。'
    },
    {
      type: 'calc',
      question: '循环队列中，rear=5, front=2，队列长度为 10，则队列中有多少个元素？',
      answer: 3,
      hint: '(rear - front + max) % max',
      explanation: '元素个数 = (rear - front + max) % max = (5 - 2 + 10) % 10 = 3。'
    },
    {
      type: 'choice',
      question: '在排序过程中，每次从未排序序列中取出第一个元素，插入到已排序序列的正确位置，这种排序是：',
      options: ['选择排序', '插入排序', '冒泡排序', '归并排序'],
      answer: 1,
      explanation: '描述的是直接插入排序的基本思想：每次将一个元素插入到已排序序列的正确位置。'
    }
  ]
}

/* ======================== 计算机组成原理题库 ======================== */
export const COMPUTER_ORGANIZATION_QUIZZES = {
  basic: [
    {
      type: 'choice',
      question: 'CPU 中程序计数器（PC）的主要功能是：',
      options: ['存储指令', '存储下一条指令的地址', '存储运算结果', '控制 I/O 设备'],
      answer: 1,
      explanation: '程序计数器（PC）存放的是下一条将要执行的指令的地址，CPU 根据 PC 从内存中取指令。'
    },
    {
      type: 'calc',
      question: '二进制数 1101 转换为十进制是多少？',
      answer: 13,
      hint: '按权展开',
      explanation: '1101₂ = 1×2³ + 1×2² + 0×2¹ + 1×2⁰ = 8 + 4 + 0 + 1 = 13。'
    },
    {
      type: 'choice',
      question: '冯·诺依曼体系结构的特点是：',
      options: ['数据和指令分开存储', '数据和指令存储在同一存储器中', '使用哈佛结构', '没有控制单元'],
      answer: 1,
      explanation: '冯·诺依曼体系的核心是存储程序概念：指令和数据存储在同一个存储器中。'
    },
    {
      type: 'choice',
      question: '在计算机组成中，Cache 的作用是：',
      options: ['扩大内存容量', '缓解 CPU 与内存之间的速度差异', '存储操作系统内核', '管理 I/O 设备'],
      answer: 1,
      explanation: 'Cache 利用程序访问的局部性原理，将经常访问的数据缓存到更快的存储介质中，缓解 CPU 与主存之间的速度差距。'
    },
    {
      type: 'calc',
      question: '1KB 等于多少字节？',
      answer: 1024,
      hint: '计算机中 1K = 2¹⁰',
      explanation: '在计算机中，1KB = 2¹⁰ = 1024 字节。'
    },
    {
      type: 'choice',
      question: '下列哪个属于 CPU 的运算器部件？',
      options: ['程序计数器', '指令寄存器', '算术逻辑单元（ALU）', '地址寄存器'],
      answer: 2,
      explanation: '算术逻辑单元（ALU）是运算器的核心部件，用于执行算术和逻辑运算。其余选项均属于控制器。'
    },
    {
      type: 'choice',
      question: '原码、补码、反码中，哪种编码在现代计算机中广泛用于表示有符号整数？',
      options: ['原码', '补码', '反码', '移码'],
      answer: 1,
      explanation: '补码是现代计算机中最常用的有符号整数表示法，它将减法转化为加法，且 0 的表示唯一。'
    },
    {
      type: 'calc',
      question: '十六进制数 FF 转换为十进制是多少？',
      answer: 255,
      hint: 'FF = 15×16 + 15',
      explanation: 'FF₁₆ = 15×16¹ + 15×16⁰ = 240 + 15 = 255。'
    },
    {
      type: 'choice',
      question: 'CPU 中负责指令译码的部件是：',
      options: ['ALU', '控制器', '寄存器', 'Cache'],
      answer: 1,
      explanation: '控制器负责从内存取指令、译码并产生控制信号指挥各部件协调工作。'
    },
    {
      type: 'choice',
      question: 'RAM 的特点是：',
      options: ['断电后数据不丢失', '断电后数据丢失', '只能读取不能写入', '速度比寄存器快'],
      answer: 1,
      explanation: 'RAM（随机存取存储器）是易失性存储器，断电后数据丢失。ROM 断电后数据不丢失。'
    }
  ],
  intermediate: [
    {
      type: 'choice',
      question: '在 Cache 的三种映射方式中，冲突率最低但硬件开销最大的是：',
      options: ['直接映射', '全相联映射', '组相联映射', '以上都不对'],
      answer: 1,
      explanation: '全相联映射允许主存任何一块映射到 Cache 中任何一块，冲突率最低，但需要并行比较所有 Cache 块的标记，硬件最复杂。'
    },
    {
      type: 'calc',
      question: '若主存地址为 32 位，按字节编址，则主存最大容量为多少？',
      answer: 4,
      hint: '2³² 字节 = ? GB',
      explanation: '2³² 字节 = 2³² / 2³⁰ GB = 4GB。'
    },
    {
      type: 'choice',
      question: '指令流水线技术的主要目的是：',
      options: ['减少指令条数', '提高指令执行吞吐率', '降低功耗', '简化硬件设计'],
      answer: 1,
      explanation: '指令流水线将指令执行过程分为多个阶段并行处理，提高指令执行的吞吐率，但不减少单条指令的执行时间。'
    },
    {
      type: 'choice',
      question: 'DMA 方式的主要优点是：',
      options: ['传输速度快', '无需 CPU 干预传输过程', '实现简单', '成本低'],
      answer: 1,
      explanation: 'DMA（直接存储器访问）允许外设直接与内存交换数据，不需要 CPU 的干预，提高了 CPU 的利用率。'
    },
    {
      type: 'calc',
      question: '一个 8 位二进制补码能表示的最小整数是？',
      answer: -128,
      hint: '8 位补码范围',
      explanation: '8 位补码表示范围是 -128 ~ 127。最小值为 10000000₂ = -128。'
    },
    {
      type: 'choice',
      question: '以下哪种存储器速度最快？',
      options: ['硬盘', '内存（DRAM）', '寄存器', 'Cache（SRAM）'],
      answer: 2,
      explanation: '寄存器位于 CPU 内部，速度最快。速度排序：寄存器 > Cache(SRAM) > 内存(DRAM) > 硬盘。'
    },
    {
      type: 'calc',
      question: '一个指令周期由 4 个机器周期组成，每个机器周期含 5 个时钟周期，该指令的执行需要多少个时钟周期？',
      answer: 20,
      hint: '指令周期数 = 机器周期数 × 每周期时钟数',
      explanation: '4 × 5 = 20 个时钟周期。'
    },
    {
      type: 'choice',
      question: '在计算机中，采用层次化存储系统的目的是：',
      options: ['降低成本的同时提高访问速度', '增加存储容量', '简化硬件设计', '降低功耗'],
      answer: 0,
      explanation: '层次化存储系统（寄存器-Cache-内存-硬盘）在成本、速度和容量之间取得平衡，使系统以接近最快的速度访问大部分数据。'
    },
    {
      type: 'calc',
      question: '若 Cache 的命中率为 95%，Cache 访问时间为 1ns，内存访问时间为 10ns，则平均访问时间为多少 ns？',
      answer: 1.45,
      hint: '平均访问时间 = 命中率×Cache时间 + 未命中率×内存时间',
      explanation: '平均访问时间 = 0.95×1 + 0.05×10 = 0.95 + 0.5 = 1.45ns。'
    },
    {
      type: 'choice',
      question: '下列寻址方式中，操作数在指令中直接给出的是：',
      options: ['立即寻址', '直接寻址', '寄存器寻址', '间接寻址'],
      answer: 0,
      explanation: '立即寻址：操作数直接包含在指令中，速度最快但操作数大小受限。'
    }
  ],
  advanced: [
    {
      type: 'analysis',
      question: '解释 Cache 的局部性原理，并说明时间局部性和空间局部性的区别。',
      answer: '局部性原理：程序在执行过程中，对存储器的访问呈现集中趋势。\n时间局部性：刚刚被访问的单元在不久的将来很可能被再次访问（如循环中的指令和变量）。\n空间局部性：刚刚被访问的单元邻近的单元在不久的将来很可能被访问（如数组的顺序访问）。\nCache 正是利用这两类局部性来提高命中率的。',
      explanation: '局部性原理是 Cache 能有效工作的理论依据，也是计算机体系结构的重要概念。'
    },
    {
      type: 'analysis',
      question: '简述 RISC 和 CISC 的主要区别。',
      answer: 'RISC（精简指令集计算机）：指令格式固定、指令数量少、寻址方式少、通常为加载-存储架构、硬布线控制、流水线效率高。\nCISC（复杂指令集计算机）：指令格式可变、指令数量多、寻址方式丰富、允许内存操作数、微程序控制、指令功能强大。\n现代趋势：两者相互融合，如 x86 采用微操作转换为类 RISC 的内部指令。',
      explanation: 'RISC 和 CISC 是两种不同的指令集设计哲学，各有优缺点。'
    },
    {
      type: 'choice',
      question: '在浮点数表示中，IEEE 754 标准单精度浮点数的阶码采用什么编码？',
      options: ['原码', '补码', '移码', '反码'],
      answer: 2,
      explanation: 'IEEE 754 标准中，阶码采用移码（偏移值为 127）表示，便于比较浮点数的大小。'
    },
    {
      type: 'analysis',
      question: '解释中断处理的基本流程。',
      answer: '中断处理流程：\n1. 中断请求：设备向 CPU 发送中断信号\n2. 中断响应：CPU 执行完当前指令后，检测到中断请求\n3. 保护现场：保存 PC 和程序状态字（PSW）\n4. 中断识别：识别中断源，找到中断服务程序入口\n5. 中断服务：执行中断服务程序\n6. 恢复现场：恢复 PC 和 PSW\n7. 中断返回：继续执行被中断的程序',
      explanation: '中断机制是实现 I/O 操作和操作系统功能的重要硬件基础。'
    },
    {
      type: 'calc',
      question: '一个 4 级指令流水线的理想吞吐率是单周期处理器的几倍？',
      answer: 4,
      hint: '理想情况每周期完成一条指令',
      explanation: '4 级流水线理想情况下，每时钟周期可完成一条指令，吞吐率是单周期处理器的 4 倍。'
    },
    {
      type: 'analysis',
      question: '解释什么是"流水线冒险"（Pipeline Hazard），并列举类型。',
      answer: '流水线冒险是指由于下一条指令无法在下一个时钟周期执行而导致流水线停顿的情况，分为三类：\n1. 结构冒险：硬件资源冲突（如同时访问同一存储器）\n2. 数据冒险：指令之间存在数据依赖（RAW、WAR、WAW）\n3. 控制冒险：分支指令导致流水线需要冲刷\n\n解决方法：插入气泡（stall）、转发（forwarding）、分支预测等。',
      explanation: '流水线冒险是计算机组成原理中的核心概念，考研常考。'
    },
    {
      type: 'choice',
      question: '主存和 CPU 之间增加 Cache 后，CPU 访问主存的次数会：',
      options: ['增加', '减少', '不变', '不确定'],
      answer: 1,
      explanation: 'Cache 命中时 CPU 直接访问 Cache，无需访问主存。有效降低 CPU 访问主存的次数。'
    }
  ]
}

/* ======================== 操作系统题库 ======================== */
export const OPERATING_SYSTEM_QUIZZES = {
  basic: [
    {
      type: 'choice',
      question: '进程与程序的主要区别是：',
      options: ['进程是静态的，程序是动态的', '进程是动态的，程序是静态的', '两者没有区别', '程序有PCB，进程没有'],
      answer: 1,
      explanation: '进程是程序的一次动态执行过程，有生命周期，而程序是静态的代码集合。'
    },
    {
      type: 'choice',
      question: '操作系统的主要功能不包括：',
      options: ['进程管理', '存储管理', '编译程序', '文件管理'],
      answer: 2,
      explanation: '编译程序是编译器的功能，不属于操作系统的基本功能。操作系统的功能包括进程管理、存储管理、文件管理、设备管理等。'
    },
    {
      type: 'choice',
      question: '系统调用与普通函数调用的主要区别是：',
      options: ['系统调用参数更多', '系统调用需要切换到内核态', '系统调用返回更快', '没有区别'],
      answer: 1,
      explanation: '系统调用需要从用户态切换到内核态，由操作系统内核代为执行，开销大于普通函数调用。'
    },
    {
      type: 'choice',
      question: '下列哪种是进程间通信（IPC）的方式？',
      options: ['管道', '递归', '循环', '指针'],
      answer: 0,
      explanation: '管道（Pipe）是 UNIX 系统中经典的 IPC 方式，此外还有消息队列、共享内存、信号量等。'
    },
    {
      type: 'fill',
      question: '操作系统为每个进程维护的数据结构叫做______。',
      answer: 'PCB',
      hint: '英文缩写，3个大写字母',
      explanation: 'PCB（Process Control Block，进程控制块）是操作系统用于描述和管理进程的数据结构。'
    },
    {
      type: 'choice',
      question: '用户态和内核态的区别在于：',
      options: ['内存大小不同', 'CPU 权限级别不同', '硬盘速度不同', '网络连接不同'],
      answer: 1,
      explanation: '用户态只能执行非特权指令，内核态可以执行所有指令（包括特权指令）。这是保护系统安全的关键机制。'
    },
    {
      type: 'calc',
      question: '某进程的页表大小为 1MB，假设每页大小为 4KB，该进程共有多少页？',
      answer: 256,
      hint: '1MB / 4KB',
      explanation: '1MB = 1024KB，1024KB / 4KB = 256 页。'
    },
    {
      type: 'choice',
      question: '进程的三个基本状态不包括：',
      options: ['就绪态', '运行态', '阻塞态', '终止态'],
      answer: 3,
      explanation: '进程的三个基本状态是：就绪（Ready）、运行（Running）、阻塞（Blocked）。终止态不是基本状态。'
    },
    {
      type: 'calc',
      question: '一个程序有 5 个进程，每个进程最多需要 3 个资源，系统至少需要多少个资源才不会发生死锁？',
      answer: 11,
      hint: '最坏：每个进程已分配 2 个',
      explanation: '最坏情况每个进程分配 2 个资源（共 10 个），再增加 1 个即可保证至少一个进程完成。5×(3-1) + 1 = 11。'
    },
    {
      type: 'choice',
      question: '操作系统中，进程调度的主要目的是：',
      options: ['提高 CPU 利用率', '增加内存容量', '管理文件', '防止病毒'],
      answer: 0,
      explanation: '进程调度决定哪个进程获得 CPU 使用权，主要目标是提高 CPU 利用率、公平性和响应速度。'
    }
  ],
  intermediate: [
    {
      type: 'choice',
      question: '下列哪种调度算法可能导致"饥饿"现象？',
      options: ['先来先服务（FCFS）', '短作业优先（SJF）', '时间片轮转（RR）', '最高响应比优先（HRRN）'],
      answer: 1,
      explanation: 'SJF 可能导致长作业长期得不到调度，即"饥饿"现象。HRRN 通过动态计算响应比解决了这一问题。'
    },
    {
      type: 'calc',
      question: '在分页系统中，逻辑地址为 1024，页面大小为 256，页号为多少？',
      answer: 4,
      hint: '页号 = 逻辑地址 / 页大小',
      explanation: '页号 = floor(1024 / 256) = 4，页内偏移 = 1024 % 256 = 0。'
    },
    {
      type: 'fill',
      question: '在分页存储管理中，逻辑地址到物理地址的转换通过______完成。',
      answer: '页表',
      hint: '操作系统为每个进程维护的数据结构',
      explanation: '页表记录了逻辑页面与物理页框之间的映射关系，是分页系统的核心数据结构。'
    },
    {
      type: 'choice',
      question: '虚拟存储器的基本思想是：',
      options: ['扩大物理内存', '将硬盘作为内存的扩展', '减少程序大小', '提高 CPU 速度'],
      answer: 1,
      explanation: '虚拟存储器将硬盘（交换区）作为内存的扩展，使程序可以运行在比实际物理内存更大的地址空间中。'
    },
    {
      type: 'choice',
      question: '文件系统中，索引节点（inode）不包含以下哪项信息？',
      options: ['文件大小', '文件权限', '文件名', '数据块指针'],
      answer: 2,
      explanation: '文件名通常存储在目录项中，而不是 inode 中。inode 存储文件的元数据（大小、权限、时间戳、数据块指针等）。'
    },
    {
      type: 'calc',
      question: '有 3 个进程共享一个资源，每个进程最多需要 2 个资源。系统至少需要多少个资源才不会发生死锁？',
      answer: 4,
      hint: '最坏情况：每个进程已分配 1 个',
      explanation: '最坏情况下每个进程各分配 1 个资源（共 3 个），此时再增加 1 个资源即可保证至少一个进程获得全部所需资源。3+1=4。'
    },
    {
      type: 'choice',
      question: '在请求分页系统中，当 CPU 访问的页面不在内存中时，会触发：',
      options: ['系统调用', '缺页中断', '进程调度', 'I/O 中断'],
      answer: 1,
      explanation: '缺页中断（Page Fault）是指程序访问的页面不在内存中时触发的异常，操作系统负责将所需页面从磁盘调入内存。'
    },
    {
      type: 'calc',
      question: '某系统采用 LRU 页面置换算法，内存中有 3 个页框。页面访问序列为 1,2,3,4,1,2,5，共发生几次缺页？',
      answer: 6,
      hint: 'LRU 置换最久未使用的页面',
      explanation: '序列：1(缺)→2(缺)→3(缺)→4(缺,置换1)→1(缺,置换2)→2(缺,置换3)→5(缺,置换4)。共 6 次缺页。第一次访问均为缺页。'
    },
    {
      type: 'choice',
      question: '文件系统中，位示图（bitmap）用于：',
      options: ['管理空闲磁盘块', '存储文件内容', '管理目录结构', '实现文件共享'],
      answer: 0,
      explanation: '位示图使用二进制位表示磁盘块的空闲状态（0 空闲、1 已分配），是空闲磁盘空间管理的一种方法。'
    }
  ],
  advanced: [
    {
      type: 'analysis',
      question: '描述银行家算法（Banker\'s Algorithm）的基本思想，并用它解释如何避免死锁。',
      answer: '银行家算法的核心思想：系统在分配资源之前，先计算分配后是否处于安全状态。如果存在安全序列（所有进程都能依次获得所需资源并完成），则分配；否则不分配。\n\n安全状态检查：找到一个进程 Need ≤ Available，假设其完成后释放资源，重复直到所有进程都可完成。',
      explanation: '银行家算法是死锁避免的经典算法，由 Dijkstra 提出。'
    },
    {
      type: 'analysis',
      question: '简述死锁产生的四个必要条件。',
      answer: '死锁的四个必要条件：\n1. 互斥条件：资源每次只能被一个进程使用\n2. 请求与保持条件：进程已持有资源，又请求新的资源\n3. 不剥夺条件：已分配的资源不能被强行剥夺\n4. 循环等待条件：存在进程资源的循环等待链\n\n破坏任意一个条件即可避免死锁。',
      explanation: '这四个条件必须同时满足才会发生死锁。实际系统中常通过破坏"请求与保持"或"循环等待"来预防死锁。'
    },
    {
      type: 'choice',
      question: '页面置换算法中，理论上性能最优的是：',
      options: ['FIFO', 'LRU', 'OPT（最佳置换）', 'CLOCK'],
      answer: 2,
      explanation: 'OPT（最佳置换算法）选择未来最长时间不会被访问的页面置换，缺页率最低。但无法实现，仅作为理论参考基准。'
    },
    {
      type: 'analysis',
      question: '请比较分段存储和分页存储的区别。',
      answer: '分页：将逻辑地址空间划分为大小相等的页，页大小固定（如 4KB），对程序员透明，目的是管理内存碎片。\n分段：将逻辑地址空间按逻辑意义划分为大小不等的段（如代码段、数据段），段大小可变，对程序员可见，目的是方便共享和保护。\n现代系统通常结合两者（段页式）：先分段，每段内再分页。',
      explanation: '分页解决碎片问题，分段解决逻辑组织和共享保护问题。'
    },
    {
      type: 'calc',
      question: '磁盘调度算法中，SCAN（电梯算法）的磁头移动方向是：',
      answer: 1,
      hint: '填 1 表示单向到底再折返，填 0 表示来回扫描',
      explanation: 'SCAN 算法（电梯算法）：磁头从一端开始向另一端移动，服务沿途请求，到达另一端后立即折返。'
    },
    {
      type: 'analysis',
      question: '解释信号量（Semaphore）的 P 操作和 V 操作的含义。',
      answer: '信号量是用于进程同步和互斥的机制。\nP 操作（wait）：S = S - 1，若 S < 0，则进程阻塞进入等待队列。\nV 操作（signal）：S = S + 1，若 S ≤ 0，则唤醒等待队列中的一个进程。\n\nP 操作申请资源，V 操作释放资源。用互斥信号量实现互斥访问，用同步信号量实现进程同步。',
      explanation: 'P/V 操作是原子操作，由 Dijkstra 提出，是操作系统中经典的同步机制。'
    },
    {
      type: 'choice',
      question: '下列哪种情况会导致系统进入不安全状态但未必死锁？',
      options: ['资源耗尽', '存在循环等待链', '所有进程都在等待 I/O', 'CPU 空闲'],
      answer: 1,
      explanation: '循环等待是死锁的必要条件之一。存在循环等待链时系统处于不安全状态，但不一定已经发生死锁。'
    }
  ]
}

/* ======================== 计算机网络题库 ======================== */
export const COMPUTER_NETWORK_QUIZZES = {
  basic: [
    {
      type: 'choice',
      question: 'OSI 参考模型共有几层？',
      options: ['4层', '5层', '7层', '6层'],
      answer: 2,
      explanation: 'OSI 参考模型分为 7 层：物理层、数据链路层、网络层、传输层、会话层、表示层、应用层。'
    },
    {
      type: 'choice',
      question: 'TCP/IP 协议栈中，IP 协议工作在哪一层？',
      options: ['应用层', '传输层', '网络层', '网络接口层'],
      answer: 2,
      explanation: 'IP 协议工作在网络层（Internet 层），负责数据包的路由和转发。'
    },
    {
      type: 'choice',
      question: 'HTTP 默认使用的端口号是：',
      options: ['21', '80', '443', '8080'],
      answer: 1,
      explanation: 'HTTP 默认端口为 80，HTTPS 默认端口为 443。'
    },
    {
      type: 'choice',
      question: 'TCP 协议工作在 OSI 模型的哪一层？',
      options: ['网络层', '传输层', '应用层', '数据链路层'],
      answer: 1,
      explanation: 'TCP（传输控制协议）工作在传输层，提供可靠的、面向连接的字节流服务。'
    },
    {
      type: 'calc',
      question: 'IP 地址 192.168.1.0/24 可以分配给主机的有效 IP 地址有多少个？',
      answer: 254,
      hint: '排除网络地址和广播地址',
      explanation: '/24 表示子网掩码有 24 位，主机位 8 位，共 2⁸ = 256 个地址。排除网络地址（主机位全0）和广播地址（主机位全1），剩余 254 个可用地址。'
    },
    {
      type: 'choice',
      question: 'DNS 的主要功能是：',
      options: ['分配IP地址', '域名到IP地址的解析', '数据加密', '路由选择'],
      answer: 1,
      explanation: 'DNS（域名系统）将人类易记的域名（如 www.example.com）解析为计算机可识别的 IP 地址。'
    },
    {
      type: 'choice',
      question: '以下哪个是私有IP地址？',
      options: ['8.8.8.8', '192.168.1.1', '114.114.114.114', '1.1.1.1'],
      answer: 1,
      explanation: '192.168.0.0/16 是私有地址范围。8.8.8.8 是 Google DNS，114.114.114.114 是中国公共 DNS。'
    },
    {
      type: 'choice',
      question: '下列网络设备中，工作在数据链路层的是：',
      options: ['路由器', '交换机', '集线器', '调制解调器'],
      answer: 1,
      explanation: '交换机（Switch）工作在数据链路层（第2层），根据 MAC 地址转发帧。路由器工作在网络层，集线器工作在物理层。'
    },
    {
      type: 'choice',
      question: 'HTTP 协议是一种：',
      options: ['面向连接的协议', '无状态的协议', '可靠的传输协议', '加密的协议'],
      answer: 1,
      explanation: 'HTTP 是无状态的协议，每个请求之间相互独立。Cookie 和 Session 用于在无状态的 HTTP 上维持状态。'
    },
    {
      type: 'fill',
      question: 'IPv6 地址的位数为______。',
      answer: '128',
      hint: 'IPv4 是 32 位',
      explanation: 'IPv6 地址长度为 128 位，远多于 IPv4 的 32 位，解决了 IP 地址枯竭问题。'
    }
  ],
  intermediate: [
    {
      type: 'choice',
      question: 'TCP 三次握手中，第二次握手发送的报文段中哪个标志位被置位？',
      options: ['仅 SYN', '仅 ACK', 'SYN + ACK', '仅 FIN'],
      answer: 2,
      explanation: '第二次握手：服务器发送 SYN + ACK 报文段，确认客户端的 SYN 同时请求建立连接。'
    },
    {
      type: 'choice',
      question: 'UDP 相比于 TCP 的特点不包括：',
      options: ['无连接', '不可靠', '有拥塞控制', '开销小'],
      answer: 2,
      explanation: 'UDP 没有拥塞控制，这是它与 TCP 的重要区别之一。UDP 的特点是无连接、不可靠、开销小、传输快。'
    },
    {
      type: 'calc',
      question: 'C 类地址默认子网掩码是什么？',
      answer: 24,
      hint: '用 CIDR 前缀长度表示（数字）',
      explanation: 'C 类地址默认子网掩码为 255.255.255.0，CIDR 前缀长度为 /24。'
    },
    {
      type: 'choice',
      question: '路由器工作在 OSI 模型的第几层？',
      options: ['物理层', '数据链路层', '网络层', '传输层'],
      answer: 2,
      explanation: '路由器工作在网络层（第3层），根据 IP 地址进行路由选择和转发。交换机组工作在数据链路层（第2层）。'
    },
    {
      type: 'choice',
      question: '在 TCP 拥塞控制中，慢启动阶段拥塞窗口的增长方式是：',
      options: ['线性增长', '指数增长', '固定不变', '随机增长'],
      answer: 1,
      explanation: '慢启动阶段：每收到一个 ACK，拥塞窗口增加 1 个 MSS（实质是每 RTT 翻倍），呈指数增长。'
    },
    {
      type: 'choice',
      question: 'ARP 协议的功能是：',
      options: ['域名解析', 'IP 地址解析为 MAC 地址', '路由选择', '分配 IP 地址'],
      answer: 1,
      explanation: 'ARP（地址解析协议）将 IP 地址解析为 MAC 地址，是网络层与数据链路层的接口。'
    },
    {
      type: 'fill',
      question: '电子邮件发送使用的协议是______。',
      answer: 'SMTP',
      hint: '英文缩写，4个大写字母',
      explanation: 'SMTP（Simple Mail Transfer Protocol）用于发送电子邮件，POP3/IMAP 用于接收邮件。'
    },
    {
      type: 'choice',
      question: '在 TCP 流量控制中，使用的机制是：',
      options: ['滑动窗口', '拥塞窗口', '慢启动', '快恢复'],
      answer: 0,
      explanation: 'TCP 使用滑动窗口机制进行流量控制，接收方通过通告窗口大小告知发送方自己还能接收多少数据。'
    },
    {
      type: 'calc',
      question: '将 IP 地址 192.168.1.10 和子网掩码 255.255.255.0 进行与运算，得到的网络地址最后一位是多少？',
      answer: 0,
      hint: 'IP 与 子网掩码按位与',
      explanation: '192.168.1.10 AND 255.255.255.0 = 192.168.1.0，最后一位为 0。'
    },
    {
      type: 'choice',
      question: 'OSPF 路由协议使用的算法是：',
      options: ['距离向量算法', '链路状态算法', '路径向量算法', '静态路由'],
      answer: 1,
      explanation: 'OSPF（开放最短路径优先）使用链路状态算法（Dijkstra），每个路由器维护整个网络的拓扑图。RIP 使用距离向量算法。'
    }
  ],
  advanced: [
    {
      type: 'analysis',
      question: '请比较 TCP 和 UDP 的区别，并说明各自适用的场景。',
      answer: 'TCP（传输控制协议）：面向连接、可靠传输、有流量控制和拥塞控制、按序到达、开销大。适用于文件传输（FTP）、网页浏览（HTTP）、电子邮件（SMTP）。\nUDP（用户数据报协议）：无连接、不可靠、无拥塞控制、开销小、传输快。适用于视频直播、在线游戏、DNS 查询。',
      explanation: '选择 TCP 还是 UDP 的核心权衡：可靠性 vs 实时性。'
    },
    {
      type: 'analysis',
      question: '简述 TCP 四次挥手的过程。',
      answer: 'TCP 四次挥手过程：\n1. 客户端发送 FIN 报文，进入 FIN_WAIT_1 状态\n2. 服务器收到后发送 ACK 报文，进入 CLOSE_WAIT 状态（客户端进入 FIN_WAIT_2）\n3. 服务器发送 FIN 报文，进入 LAST_ACK 状态\n4. 客户端发送 ACK 报文，进入 TIME_WAIT 状态（等待 2MSL 后关闭）\n服务器收到 ACK 后立即关闭。',
      explanation: '四次挥手是因为 TCP 是全双工的，双方需要各自关闭自己的连接。TIME_WAIT 确保最后一个 ACK 到达。'
    },
    {
      type: 'choice',
      question: '下列哪种攻击利用了 TCP 三次握手的漏洞？',
      options: ['DNS 劫持', 'SYN Flood 攻击', 'ARP 欺骗', 'XSS 攻击'],
      answer: 1,
      explanation: 'SYN Flood 攻击通过发送大量 SYN 报文但不完成三次握手，耗尽服务器的半连接队列，是一种典型的 DoS 攻击。'
    },
    {
      type: 'analysis',
      question: '简述 HTTPS 的工作原理及与 HTTP 的主要区别。',
      answer: 'HTTPS = HTTP + SSL/TLS。工作原理：\n1. 客户端请求 HTTPS 连接\n2. 服务器返回数字证书（含公钥）\n3. 客户端验证证书有效性\n4. 客户端生成对称密钥，用服务器公钥加密后发送\n5. 服务器用私钥解密获得对称密钥\n6. 双方用对称密钥加密通信\n\n与 HTTP 的区别：HTTPS 提供加密传输、身份验证、数据完整性校验，但连接建立时间更长、需要证书开销。',
      explanation: 'HTTPS 结合了非对称加密（传输密钥）和对称加密（加密数据）的优点。'
    },
    {
      type: 'analysis',
      question: '解释 CSMA/CD 协议的工作原理。',
      answer: 'CSMA/CD（载波监听多点接入/碰撞检测）是以太网的核心协议。\n1. 先听后说：发送前监听信道，空闲则发送，忙则等待\n2. 边听边说：发送过程中持续检测碰撞\n3. 碰撞停止：检测到碰撞立即停止发送\n4. 随机等待：等待随机时间后重试（截断二进制指数退避）',
      explanation: 'CSMA/CD 适用于有线以太网。无线网络使用 CSMA/CA（碰撞避免）因为无法实现碰撞检测。'
    },
    {
      type: 'calc',
      question: '若主机 A 向主机 B 发送数据，RTT = 20ms，TCP 拥塞窗口从 1 开始，慢启动阶段到达 16 需要几个 RTT？',
      answer: 4,
      hint: '慢启动每 RTT 翻倍',
      explanation: '慢启动窗口增长：1→2→4→8→16，共 4 个 RTT。每经过一个 RTT，拥塞窗口翻倍。'
    },
    {
      type: 'choice',
      question: '数字签名技术中，发送方使用什么密钥对消息摘要进行加密？',
      options: ['发送方的私钥', '发送方的公钥', '接收方的私钥', '接收方的公钥'],
      answer: 0,
      explanation: '数字签名使用发送方的私钥加密摘要，接收方使用发送方的公钥验证签名。这保证了身份认证和不可否认性。'
    }
  ]
}

/** 按科目和难度获取题库 */
export function getQuizzes(subject, difficulty, subCategory) {
  // 英语子类别处理
  if (subject === 'english' && subCategory) {
    const subMap = {
      postgraduate: ENGLISH_POSTGRADUATE_QUIZZES,
      cet4: CET4_ENGLISH_QUIZZES,
      cet6: CET6_ENGLISH_QUIZZES
    }
    return subMap[subCategory]?.[difficulty] || []
  }
  const map = {
    advancedMath: ADVANCED_MATH_QUIZZES,
    linearAlgebra: LINEAR_ALGEBRA_QUIZZES,
    english: ENGLISH_POSTGRADUATE_QUIZZES,
    dataStructure: DATA_STRUCTURE_QUIZZES,
    computerOrganization: COMPUTER_ORGANIZATION_QUIZZES,
    operatingSystem: OPERATING_SYSTEM_QUIZZES,
    computerNetwork: COMPUTER_NETWORK_QUIZZES
  }
  return map[subject]?.[difficulty] || []
}

/* ======================== 视频课程数据 ======================== */
export const VIDEO_COURSES = {
  advancedMath: [
    {
      id: 'am1',
      title: '函数与极限',
      desc: '函数概念、极限定义、极限运算法则、两个重要极限',
      icon: '📐',
      lessons: [
        { id: 'am1-1', title: '函数的概念与基本性质', url: 'https://player.bilibili.com/player.html?bvid=BV1Eb411u7Fw&p=1', duration: '45:00' },
        { id: 'am1-2', title: '数列极限的定义与性质', url: 'https://player.bilibili.com/player.html?bvid=BV1Eb411u7Fw&p=2', duration: '50:00' },
        { id: 'am1-3', title: '函数极限与运算法则', url: 'https://player.bilibili.com/player.html?bvid=BV1Eb411u7Fw&p=3', duration: '48:00' },
        { id: 'am1-4', title: '两个重要极限', url: 'https://player.bilibili.com/player.html?bvid=BV1Eb411u7Fw&p=4', duration: '42:00' }
      ]
    },
    {
      id: 'am2',
      title: '导数与微分',
      desc: '导数定义、求导法则、高阶导数、微分的应用',
      icon: '📈',
      lessons: [
        { id: 'am2-1', title: '导数的定义与几何意义', url: 'https://player.bilibili.com/player.html?bvid=BV1Eb411u7Fw&p=5', duration: '48:00' },
        { id: 'am2-2', title: '求导法则与基本公式', url: 'https://player.bilibili.com/player.html?bvid=BV1Eb411u7Fw&p=6', duration: '52:00' },
        { id: 'am2-3', title: '高阶导数与隐函数求导', url: 'https://player.bilibili.com/player.html?bvid=BV1Eb411u7Fw&p=7', duration: '45:00' },
        { id: 'am2-4', title: '微分的概念与应用', url: 'https://player.bilibili.com/player.html?bvid=BV1Eb411u7Fw&p=8', duration: '40:00' }
      ]
    },
    {
      id: 'am3',
      title: '不定积分与定积分',
      desc: '积分概念、换元积分法、分部积分法、定积分应用',
      icon: '∫',
      lessons: [
        { id: 'am3-1', title: '不定积分的概念与基本公式', url: 'https://player.bilibili.com/player.html?bvid=BV1Eb411u7Fw&p=9', duration: '50:00' },
        { id: 'am3-2', title: '换元积分法与分部积分法', url: 'https://player.bilibili.com/player.html?bvid=BV1Eb411u7Fw&p=10', duration: '55:00' },
        { id: 'am3-3', title: '定积分的概念与性质', url: 'https://player.bilibili.com/player.html?bvid=BV1Eb411u7Fw&p=11', duration: '45:00' }
      ]
    }
  ],
  linearAlgebra: [
    {
      id: 'la1',
      title: '行列式',
      desc: '行列式定义、性质、展开定理、克拉默法则',
      icon: '⊡',
      lessons: [
        { id: 'la1-1', title: '行列式的定义与性质', url: 'https://player.bilibili.com/player.html?bvid=BV1Cz4y1K7Uk&p=1', duration: '48:00' },
        { id: 'la1-2', title: '行列式的展开定理', url: 'https://player.bilibili.com/player.html?bvid=BV1Cz4y1K7Uk&p=2', duration: '52:00' },
        { id: 'la1-3', title: '克拉默法则', url: 'https://player.bilibili.com/player.html?bvid=BV1Cz4y1K7Uk&p=3', duration: '38:00' }
      ]
    },
    {
      id: 'la2',
      title: '矩阵',
      desc: '矩阵运算、逆矩阵、初等变换、矩阵的秩',
      icon: '⊞',
      lessons: [
        { id: 'la2-1', title: '矩阵的定义与基本运算', url: 'https://player.bilibili.com/player.html?bvid=BV1Cz4y1K7Uk&p=4', duration: '50:00' },
        { id: 'la2-2', title: '逆矩阵与初等变换', url: 'https://player.bilibili.com/player.html?bvid=BV1Cz4y1K7Uk&p=5', duration: '55:00' },
        { id: 'la2-3', title: '矩阵的秩与线性方程组', url: 'https://player.bilibili.com/player.html?bvid=BV1Cz4y1K7Uk&p=6', duration: '48:00' }
      ]
    }
  ],
  english: {
    postgraduate: [
      {
        id: 'en-p1',
        title: '考研英语词汇精讲',
        desc: '考研核心词汇记忆法、高频词汇、真题词汇',
        icon: '📝',
        lessons: [
          { id: 'en-p1-1', title: '词根词缀记忆法', url: 'https://player.bilibili.com/player.html?bvid=BV151DCBuEwW&p=1', duration: '60:00' },
          { id: 'en-p1-2', title: '考研核心高频词汇', url: 'https://player.bilibili.com/player.html?bvid=BV151DCBuEwW&p=2', duration: '55:00' },
          { id: 'en-p1-3', title: '真题词汇精讲', url: 'https://player.bilibili.com/player.html?bvid=BV151DCBuEwW&p=3', duration: '50:00' }
        ]
      },
      {
        id: 'en-p2',
        title: '考研英语阅读高分攻略',
        desc: '阅读题型分析、长难句解析、解题技巧',
        icon: '📖',
        lessons: [
          { id: 'en-p2-1', title: '阅读题型与解题策略', url: 'https://player.bilibili.com/player.html?bvid=BV1BM7j6XEuw&p=1', duration: '50:00' },
          { id: 'en-p2-2', title: '长难句分析与理解', url: 'https://player.bilibili.com/player.html?bvid=BV1BM7j6XEuw&p=2', duration: '55:00' },
          { id: 'en-p2-3', title: '真题阅读精讲', url: 'https://player.bilibili.com/player.html?bvid=BV1BM7j6XEuw&p=3', duration: '60:00' }
        ]
      }
    ],
    cet4: [
      {
        id: 'en-c4-1',
        title: '四级听力突破',
        desc: '听力题型分析、听力技巧、真题训练',
        icon: '🎧',
        lessons: [
          { id: 'en-c4-1-1', title: '短篇新闻听力', url: 'https://player.bilibili.com/player.html?bvid=BV1AYdAB9EXQ&p=1', duration: '45:00' },
          { id: 'en-c4-1-2', title: '长对话听力技巧', url: 'https://player.bilibili.com/player.html?bvid=BV1AYdAB9EXQ&p=2', duration: '48:00' },
          { id: 'en-c4-1-3', title: '听力篇章理解', url: 'https://player.bilibili.com/player.html?bvid=BV1AYdAB9EXQ&p=3', duration: '50:00' }
        ]
      },
      {
        id: 'en-c4-2',
        title: '四级阅读与写作',
        desc: '快速阅读、选词填空、写作模板',
        icon: '✏️',
        lessons: [
          { id: 'en-c4-2-1', title: '快速阅读技巧', url: 'https://player.bilibili.com/player.html?bvid=BV1LnBGYaEAJ&p=1', duration: '42:00' },
          { id: 'en-c4-2-2', title: '选词填空与长篇阅读', url: 'https://player.bilibili.com/player.html?bvid=BV1LnBGYaEAJ&p=2', duration: '48:00' },
          { id: 'en-c4-2-3', title: '四级写作模板与范文', url: 'https://player.bilibili.com/player.html?bvid=BV1LnBGYaEAJ&p=3', duration: '55:00' }
        ]
      }
    ],
    cet6: [
      {
        id: 'en-c6-1',
        title: '六级词汇与语法',
        desc: '六级核心词汇、高级语法、长难句',
        icon: '📚',
        lessons: [
          { id: 'en-c6-1-1', title: '六级核心词汇精讲', url: 'https://player.bilibili.com/player.html?bvid=BV1aJTX6REQT&p=1', duration: '55:00' },
          { id: 'en-c6-1-2', title: '六级重点语法', url: 'https://player.bilibili.com/player.html?bvid=BV1aJTX6REQT&p=2', duration: '50:00' },
          { id: 'en-c6-1-3', title: '长难句深度解析', url: 'https://player.bilibili.com/player.html?bvid=BV1aJTX6REQT&p=3', duration: '52:00' }
        ]
      },
      {
        id: 'en-c6-2',
        title: '六级阅读与翻译',
        desc: '深度阅读、段落翻译、完形填空',
        icon: '🌐',
        lessons: [
          { id: 'en-c6-2-1', title: '仔细阅读解题技巧', url: 'https://player.bilibili.com/player.html?bvid=BV12fyBBaEGJ&p=1', duration: '48:00' },
          { id: 'en-c6-2-2', title: '段落翻译高分策略', url: 'https://player.bilibili.com/player.html?bvid=BV12fyBBaEGJ&p=2', duration: '50:00' },
          { id: 'en-c6-2-3', title: '完形填空与选词填空', url: 'https://player.bilibili.com/player.html?bvid=BV12fyBBaEGJ&p=3', duration: '42:00' }
        ]
      }
    ]
  },
  dataStructure: [
    {
      id: 'ds1',
      title: '线性表与栈队列',
      desc: '顺序表、链表、栈、队列的实现与操作',
      icon: '📋',
      lessons: [
        { id: 'ds1-1', title: '顺序表与链表的实现', url: 'https://player.bilibili.com/player.html?bvid=BV1nJ411V7bd&p=1', duration: '50:00' },
        { id: 'ds1-2', title: '栈的原理与应用', url: 'https://player.bilibili.com/player.html?bvid=BV1nJ411V7bd&p=2', duration: '45:00' },
        { id: 'ds1-3', title: '队列的原理与应用', url: 'https://player.bilibili.com/player.html?bvid=BV1nJ411V7bd&p=3', duration: '42:00' }
      ]
    },
    {
      id: 'ds2',
      title: '树与二叉树',
      desc: '二叉树遍历、线索二叉树、哈夫曼树',
      icon: '🌳',
      lessons: [
        { id: 'ds2-1', title: '二叉树的概念与遍历', url: 'https://player.bilibili.com/player.html?bvid=BV1nJ411V7bd&p=4', duration: '55:00' },
        { id: 'ds2-2', title: '线索二叉树与二叉搜索树', url: 'https://player.bilibili.com/player.html?bvid=BV1nJ411V7bd&p=5', duration: '50:00' },
        { id: 'ds2-3', title: '哈夫曼树与平衡二叉树', url: 'https://player.bilibili.com/player.html?bvid=BV1nJ411V7bd&p=6', duration: '48:00' }
      ]
    }
  ],
  computerOrganization: [
    {
      id: 'co1',
      title: 'CPU原理',
      desc: 'CPU结构、指令执行过程、控制器设计',
      icon: '🔲',
      lessons: [
        { id: 'co1-1', title: 'CPU的基本组成与功能', url: 'https://player.bilibili.com/player.html?bvid=BV1t4411e7LH&p=1', duration: '50:00' },
        { id: 'co1-2', title: '指令的执行过程', url: 'https://player.bilibili.com/player.html?bvid=BV1t4411e7LH&p=2', duration: '55:00' },
        { id: 'co1-3', title: '控制器的设计与实现', url: 'https://player.bilibili.com/player.html?bvid=BV1t4411e7LH&p=3', duration: '48:00' }
      ]
    },
    {
      id: 'co2',
      title: '存储器系统',
      desc: '存储器层次结构、Cache、虚拟存储器',
      icon: '💾',
      lessons: [
        { id: 'co2-1', title: '存储器的层次结构', url: 'https://player.bilibili.com/player.html?bvid=BV1t4411e7LH&p=4', duration: '45:00' },
        { id: 'co2-2', title: 'Cache的原理与映射方式', url: 'https://player.bilibili.com/player.html?bvid=BV1t4411e7LH&p=5', duration: '55:00' },
        { id: 'co2-3', title: '虚拟存储器技术', url: 'https://player.bilibili.com/player.html?bvid=BV1t4411e7LH&p=6', duration: '50:00' }
      ]
    }
  ],
  operatingSystem: [
    {
      id: 'os1',
      title: '进程管理',
      desc: '进程概念、调度算法、同步与互斥、死锁',
      icon: '⚙️',
      lessons: [
        { id: 'os1-1', title: '进程与线程的概念', url: 'https://player.bilibili.com/player.html?bvid=BV1YE411D7nH&p=1', duration: '50:00' },
        { id: 'os1-2', title: '进程调度算法', url: 'https://player.bilibili.com/player.html?bvid=BV1YE411D7nH&p=2', duration: '55:00' },
        { id: 'os1-3', title: '进程同步与PV操作', url: 'https://player.bilibili.com/player.html?bvid=BV1YE411D7nH&p=3', duration: '60:00' },
        { id: 'os1-4', title: '死锁的预防与避免', url: 'https://player.bilibili.com/player.html?bvid=BV1YE411D7nH&p=4', duration: '45:00' }
      ]
    },
    {
      id: 'os2',
      title: '内存管理',
      desc: '连续分配、分页分段、虚拟内存、页面置换',
      icon: '🧠',
      lessons: [
        { id: 'os2-1', title: '连续内存分配与覆盖', url: 'https://player.bilibili.com/player.html?bvid=BV1YE411D7nH&p=5', duration: '45:00' },
        { id: 'os2-2', title: '分页与分段存储管理', url: 'https://player.bilibili.com/player.html?bvid=BV1YE411D7nH&p=6', duration: '55:00' },
        { id: 'os2-3', title: '虚拟内存与页面置换算法', url: 'https://player.bilibili.com/player.html?bvid=BV1YE411D7nH&p=7', duration: '52:00' }
      ]
    }
  ],
  computerNetwork: [
    {
      id: 'cn1',
      title: '网络体系结构',
      desc: 'OSI模型、TCP/IP模型、各层功能',
      icon: '🌐',
      lessons: [
        { id: 'cn1-1', title: 'OSI七层参考模型', url: 'https://player.bilibili.com/player.html?bvid=BV1c4411d7jb&p=1', duration: '48:00' },
        { id: 'cn1-2', title: 'TCP/IP协议栈', url: 'https://player.bilibili.com/player.html?bvid=BV1c4411d7jb&p=2', duration: '50:00' },
        { id: 'cn1-3', title: '各层功能与数据封装', url: 'https://player.bilibili.com/player.html?bvid=BV1c4411d7jb&p=3', duration: '42:00' }
      ]
    },
    {
      id: 'cn2',
      title: 'TCP/IP协议详解',
      desc: 'TCP、UDP、IP、路由协议',
      icon: '📡',
      lessons: [
        { id: 'cn2-1', title: 'TCP三次握手与四次挥手', url: 'https://player.bilibili.com/player.html?bvid=BV1c4411d7jb&p=4', duration: '55:00' },
        { id: 'cn2-2', title: 'TCP拥塞控制与流量控制', url: 'https://player.bilibili.com/player.html?bvid=BV1c4411d7jb&p=5', duration: '52:00' },
        { id: 'cn2-3', title: 'IP协议与路由协议', url: 'https://player.bilibili.com/player.html?bvid=BV1c4411d7jb&p=6', duration: '50:00' }
      ]
    }
  ]
}
