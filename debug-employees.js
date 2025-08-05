// 简单的Node.js脚本来验证员工数据
import fs from 'fs';
import path from 'path';

// 读取TypeScript文件内容
const filePath = './src/mock/departments.ts';
const content = fs.readFileSync(filePath, 'utf8');

// 模拟TypeScript导入（简单解析）
console.log('🔍 分析员工数据文件...\n');

// 检查基础员工数据
const mockEmployeesMatch = content.match(/export const mockEmployees: Employee\[\] = \[([\s\S]*?)\]/);
const additionalEmployeesMatch = content.match(/export const additionalEmployees: Employee\[\] = \[([\s\S]*?)\]/);

if (mockEmployeesMatch && additionalEmployeesMatch) {
    const mockEmployeesContent = mockEmployeesMatch[1];
    const additionalEmployeesContent = additionalEmployeesMatch[1];

    // 统计职位
    const positions = {};

    // 从内容中提取职位信息
    const positionMatches = [...mockEmployeesContent.matchAll(/position: '([^']+)'/g),
                           ...additionalEmployeesContent.matchAll(/position: '([^']+)'/g)];

    positionMatches.forEach(match => {
        const position = match[1];
        positions[position] = (positions[position] || 0) + 1;
    });

    console.log('📊 职位分布统计:');
    console.log('='.repeat(40));

    // 按层级分组
    const management = ['总经理', '副总经理', '总监', '销售总监', '运营总监', '技术总监', 'HR总监', '财务总监'];
    const supervisors = ['主管', '销售主管', '运营主管'];
    const regular = ['专员', '助理', '工程师', '会计', '出纳', '实习生'];

    let managementCount = 0;
    let supervisorCount = 0;
    let regularCount = 0;

    Object.entries(positions).forEach(([pos, count]) => {
        console.log(`  ${pos}: ${count}人`);

        if (management.some(m => pos.includes(m))) {
            managementCount += count;
        } else if (supervisors.some(s => pos.includes(s))) {
            supervisorCount += count;
        } else {
            regularCount += count;
        }
    });

    console.log('\n📈 层级统计:');
    console.log(`  高管层: ${managementCount}人`);
    console.log(`  主管层: ${supervisorCount}人`);
    console.log(`  普通员工: ${regularCount}人`);
    console.log(`  总计: ${managementCount + supervisorCount + regularCount}人`);

    // 检查allEmployees导出
    if (content.includes('export const allEmployees = [...mockEmployees, ...additionalEmployees]')) {
        console.log('\n✅ allEmployees 导出正确');
    } else {
        console.log('\n❌ allEmployees 导出有问题');
    }

} else {
    console.log('❌ 无法解析员工数据');
}
