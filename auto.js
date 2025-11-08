#!/usr/bin/env node

/**
 * Automated VW Conversion Script
 * Converts px values to vw for 2xl breakpoint (1440px)
 * Formula: vw = (px / 1440) × 100
 */

const fs = require('fs');
const path = require('path');

// Conversion map for common px values
const pxToVw = (px) => {
  const vw = ((parseFloat(px) / 1440) * 100).toFixed(3);
  return vw;
};

// Patterns to match and convert
const patterns = {
  // Text sizes: text-[XXpx]
  textSize: /text-\[(\d+(?:\.\d+)?)px\]/g,
  
  // Padding: p-[XXpx], px-[XXpx], py-[XXpx], pt-[XXpx], pb-[XXpx], pl-[XXpx], pr-[XXpx]
  padding: /(p[xytblr]?)-\[(\d+(?:\.\d+)?)px\]/g,
  
  // Margin: m-[XXpx], mx-[XXpx], my-[XXpx], mt-[XXpx], mb-[XXpx], ml-[XXpx], mr-[XXpx]
  margin: /(m[xytblr]?)-\[(\d+(?:\.\d+)?)px\]/g,
  
  // Width/Height: w-[XXpx], h-[XXpx], min-w-[XXpx], max-w-[XXpx], min-h-[XXpx], max-h-[XXpx]
  dimensions: /((?:min-|max-)?[wh])-\[(\d+(?:\.\d+)?)px\]/g,
  
  // Gap: gap-[XXpx], gap-x-[XXpx], gap-y-[XXpx]
  gap: /(gap(?:-[xy])?)-\[(\d+(?:\.\d+)?)px\]/g,
  
  // Border radius: rounded-[XXpx]
  borderRadius: /(rounded(?:-[tlbr]{1,2})?)-\[(\d+(?:\.\d+)?)px\]/g,
  
  // Line height: leading-[XXpx]
  lineHeight: /(leading)-\[(\d+(?:\.\d+)?)px\]/g,
  
  // Letter spacing: tracking-[XXpx]
  letterSpacing: /(tracking)-\[(\d+(?:\.\d+)?)px\]/g,
  
  // Backdrop blur: backdrop-blur-[XXpx]
  backdropBlur: /(backdrop-blur)-\[(\d+(?:\.\d+)?)px\]/g,
  
  // Underline offset: underline-offset-[XXpx]
  underlineOffset: /(underline-offset)-\[(\d+(?:\.\d+)?)px\]/g,
  
  // Decoration: decoration-[XXpx]
  decoration: /(decoration)-\[(\d+(?:\.\d+)?)px\]/g,
};

// Utility class conversions (w-10 → 40px, etc.)
const utilityConversions = {
  // Width/Height utilities (multiply by 4 to get px, then convert)
  'w-5': '1.389vw',   // 20px
  'h-5': '1.389vw',   // 20px
  'w-10': '2.778vw',  // 40px
  'h-10': '2.778vw',  // 40px
  'w-11': '3.056vw',  // 44px
  'h-11': '3.056vw',  // 44px
  'w-48': '13.333vw', // 192px
  'w-56': '15.556vw', // 224px
  
  // Padding utilities
  'p-1': '0.278vw',   // 4px
  'p-2': '0.556vw',   // 8px
  'p-3': '0.833vw',   // 12px
  'p-4': '1.111vw',   // 16px
  'p-5': '1.389vw',   // 20px
  'p-6': '1.667vw',   // 24px
  'p-8': '2.222vw',   // 32px
  
  // Gap utilities
  'gap-3': '0.833vw',  // 12px
  'gap-4': '1.111vw',  // 16px
  'gap-6': '1.667vw',  // 24px
  'gap-8': '2.222vw',  // 32px
  'gap-12': '3.333vw', // 48px
  'gap-16': '4.444vw', // 64px
  
  // Margin/Padding variations
  'px-3': '0.833vw',
  'px-4': '1.111vw',
  'px-6': '1.667vw',
  'px-8': '2.222vw',
  'px-32': '8.889vw', // 128px
  'py-1': '0.278vw',
  'py-2': '0.556vw',
  'py-3': '0.833vw',
  'py-4': '1.111vw',
  'pt-1': '0.278vw',
  'pt-5': '1.389vw',
  'pt-14': '3.889vw', // 56px
  'pt-16': '4.444vw',
  'pt-20': '5.556vw',
  'pb-6': '1.667vw',
  'pb-20': '5.556vw',
  'mt-1': '0.278vw',
  'mt-2': '0.556vw',
  'mt-3': '0.833vw',
  'mt-10': '2.778vw',
  'mt-20': '5.556vw',
  'mb-3': '0.833vw',
  'mb-4': '1.111vw',
  'mb-6': '1.667vw',
};

/**
 * Convert a single file
 */
function convertFile(filePath, outputPath) {
  console.log(`\n📝 Converting: ${path.basename(filePath)}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let conversions = 0;
  
  // Convert arbitrary px values with patterns
  Object.entries(patterns).forEach(([name, pattern]) => {
    content = content.replace(pattern, (match, prefix, px) => {
      const vw = pxToVw(px);
      conversions++;
      
      // Check if lg: prefix exists before this
      const beforeMatch = content.substring(Math.max(0, content.indexOf(match) - 50), content.indexOf(match));
      const hasLgPrefix = beforeMatch.includes('lg:' + prefix);
      
      if (hasLgPrefix) {
        // Add 2xl: version after lg:
        return `${match} 2xl:${prefix}-[${vw}vw]`;
      } else {
        // Check if this is within an lg: context
        const classNameStart = content.lastIndexOf('className="', content.indexOf(match));
        const classNameEnd = content.indexOf('"', content.indexOf(match));
        const className = content.substring(classNameStart, classNameEnd);
        
        if (className.includes('lg:')) {
          return `${match} 2xl:${prefix}-[${vw}vw]`;
        }
        return match; // Don't convert if no lg: context
      }
    });
  });
  
  // Convert utility classes (more targeted approach)
  Object.entries(utilityConversions).forEach(([utilClass, vwValue]) => {
    // Match utility class with word boundaries and add 2xl: version
    const regex = new RegExp(`\\b(${utilClass})\\b(?!-)(?![\\w-])`, 'g');
    const matches = content.match(regex);
    
    if (matches) {
      matches.forEach(match => {
        const matchIndex = content.indexOf(match);
        const beforeContext = content.substring(Math.max(0, matchIndex - 100), matchIndex);
        
        // Only convert if in className context and not already has 2xl:
        if (beforeContext.includes('className') && !beforeContext.includes(`2xl:${match}`)) {
          const replacement = `${match} 2xl:${utilClass.replace(/^([a-z]+)/, '$1')}-[${vwValue}]`;
          content = content.replace(new RegExp(`\\b${match}\\b(?!.*2xl:)`, 'g'), replacement);
          conversions++;
        }
      });
    }
  });
  
  // Write output
  fs.writeFileSync(outputPath, content, 'utf8');
  console.log(`   ✅ Converted ${conversions} values`);
  console.log(`   📂 Output: ${path.basename(outputPath)}`);
  
  return conversions;
}

/**
 * Main conversion function
 */
function convertAllComponents() {
  console.log('🚀 Starting Automated VW Conversion');
  console.log('=' .repeat(50));
  
  const componentsToConvert = [
    'TestimonalSection.tsx',
    'ContactSection.tsx',
    'FAQSection.tsx',
    'Footer.tsx',
    'Service.tsx',
    'ServiceCarouselIntro.tsx',
  ];
  
  const uiComponentsToConvert = [
    'Accordion.tsx',
    'Tabs.tsx',
    'ContactForm.client.tsx',
  ];
  
  let totalConversions = 0;
  
  // Convert main components
  console.log('\n📦 Converting Main Components:');
  componentsToConvert.forEach(fileName => {
    const inputPath = path.join(__dirname, 'components', fileName);
    const outputPath = path.join(__dirname, 'components', fileName.replace('.tsx', '_1440.tsx'));
    
    if (fs.existsSync(inputPath)) {
      totalConversions += convertFile(inputPath, outputPath);
    } else {
      console.log(`   ⚠️  Not found: ${fileName}`);
    }
  });
  
  // Convert UI components
  console.log('\n🎨 Converting UI Components:');
  uiComponentsToConvert.forEach(fileName => {
    const inputPath = path.join(__dirname, 'components', 'ui', fileName);
    const outputPath = path.join(__dirname, 'components', 'ui', fileName.replace('.tsx', '_1440.tsx'));
    
    if (fs.existsSync(inputPath)) {
      totalConversions += convertFile(inputPath, outputPath);
    } else {
      console.log(`   ⚠️  Not found: ${fileName}`);
    }
  });
  
  console.log('\n' + '='.repeat(50));
  console.log(`🎉 Conversion Complete!`);
  console.log(`   Total conversions: ${totalConversions}`);
  console.log(`   Formula used: vw = (px / 1440) × 100`);
  console.log('\n📋 Next Steps:');
  console.log('   1. Review the converted files (*_1440.tsx)');
  console.log('   2. Test at 1440px, 1920px, and 2560px');
  console.log('   3. Replace original files when satisfied');
  console.log('   4. Run your build to verify no errors');
}

// Run if called directly
if (require.main === module) {
  convertAllComponents();
}

module.exports = { convertFile, pxToVw };