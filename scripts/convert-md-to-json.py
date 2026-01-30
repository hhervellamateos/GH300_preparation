#!/usr/bin/env python3
"""
Convert Markdown test files to JSON format for the React app.
Processes both questions and answers/explanations from separate MD files.
"""

import json
import re
from pathlib import Path
from typing import List, Dict, Any


def parse_questions(md_file: Path) -> List[Dict[str, Any]]:
    """Parse questions from markdown file."""
    questions = []
    
    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split by "### Domain:" to get question blocks
    sections = content.split('### Domain:')
    
    for section in sections[1:]:  # Skip the first empty part
        lines = section.strip().split('\n')
        if len(lines) < 2:
            continue
        
        # First line is the domain
        domain = lines[0].strip()
        
        # Find question line (starts with "### Question")
        question_line = None
        for i, line in enumerate(lines):
            if line.startswith('### Question'):
                question_line = i
                break
        
        if question_line is None:
            continue
        
        # Extract question number and text
        question_match = re.match(r'### Question (\d+):\s*(.+)', lines[question_line])
        if not question_match:
            continue
        
        number = int(question_match.group(1))
        question_text = question_match.group(2).strip()
        
        # Collect remaining lines for question text until we hit options
        full_text_lines = [question_text]
        current_line = question_line + 1
        
        while current_line < len(lines) and not lines[current_line].startswith('####'):
            if lines[current_line].strip():
                full_text_lines.append(lines[current_line].strip())
            current_line += 1
        
        question_text = ' '.join(full_text_lines)
        
        # Extract options (lines starting with ####)
        options = []
        for line in lines[current_line:]:
            # Pattern: #### [ ] A. option text
            option_match = re.match(r'####\s*\[\s*\]\s*([A-E])\.\s*(.+)', line)
            if option_match:
                letter = option_match.group(1)
                option_text = option_match.group(2).strip()
                options.append({
                    'letter': letter,
                    'text': option_text
                })
        
        questions.append({
            'number': number,
            'domain': domain,
            'text': question_text,
            'options': options,
            'correctAnswers': [],  # Will be filled from answers file
            'explanation': '',  # Will be filled from explanations file
            'isMultiSelect': False  # Will be determined from answers
        })
    
    return questions


def parse_answers(md_file: Path) -> Dict[int, List[str]]:
    """Parse correct answers from markdown file."""
    answers = {}
    
    with open(md_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Pattern: "1. B" or "5. A, B, E"
        match = re.match(r'^(\d+)\.\s*([A-E](?:,\s*[A-E])*)', line)
        if match:
            number = int(match.group(1))
            answer_letters = [a.strip() for a in match.group(2).split(',')]
            answers[number] = answer_letters
    
    return answers


def parse_explanations(md_file: Path) -> Dict[int, str]:
    """Parse explanations from markdown file."""
    explanations = {}
    
    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split by "### Question" to get explanation blocks
    sections = content.split('### Question ')
    
    for section in sections[1:]:  # Skip first empty part
        lines = section.strip().split('\n')
        if len(lines) < 1:
            continue
        
        # First line should be the question number
        number_match = re.match(r'^(\d+)', lines[0])
        if not number_match:
            continue
        
        number = int(number_match.group(1))
        
        # Join all lines after the number as the explanation
        explanation_text = '\n'.join(lines[1:]).strip()
        
        explanations[number] = explanation_text
    
    return explanations


def merge_test_data(questions: List[Dict], answers: Dict[int, List[str]], 
                    explanations: Dict[int, str]) -> List[Dict]:
    """Merge questions, answers, and explanations."""
    for question in questions:
        num = question['number']
        
        if num in answers:
            question['correctAnswers'] = answers[num]
            question['isMultiSelect'] = len(answers[num]) > 1
        
        if num in explanations:
            question['explanation'] = explanations[num]
    
    return questions


def extract_domains(questions: List[Dict]) -> List[str]:
    """Extract unique domains from questions."""
    domains = set()
    for q in questions:
        domains.add(q['domain'])
    return sorted(list(domains))


def create_test_json(test_id: int, questions: List[Dict]) -> Dict[str, Any]:
    """Create complete test JSON structure."""
    return {
        'id': test_id,
        'title': f'GH-300 Practice Test {test_id}',
        'questions': questions,
        'domains': extract_domains(questions),
        'passingScore': 36,
        'timeLimit': 100
    }


def main():
    """Main conversion process."""
    workspace = Path(__file__).parent.parent
    docs_dir = workspace / 'docs'
    frontend_data_dir = workspace / 'frontend' / 'src' / 'data'
    
    # Create data directory if it doesn't exist
    frontend_data_dir.mkdir(parents=True, exist_ok=True)
    
    # Process Test 1
    print("Processing Test 1...")
    test1_questions = parse_questions(workspace / 'copilot_test_1_questions.md')
    test1_answers = parse_answers(docs_dir / 'copilot_test_1_answers.md')
    test1_explanations = parse_explanations(docs_dir / 'copilot_test_1_explanations.md')
    test1_data = merge_test_data(test1_questions, test1_answers, test1_explanations)
    test1_json = create_test_json(1, test1_data)
    
    with open(frontend_data_dir / 'test1.json', 'w', encoding='utf-8') as f:
        json.dump(test1_json, f, indent=2, ensure_ascii=False)
    print(f"✓ Test 1 saved: {len(test1_data)} questions")
    
    # Process Test 2
    print("Processing Test 2...")
    test2_questions = parse_questions(workspace / 'copilot_test_2_questions.md')
    test2_answers = parse_answers(docs_dir / 'copilot_test_2_answers.md')
    test2_explanations = parse_explanations(docs_dir / 'copilot_test_2_explanations.md')
    test2_data = merge_test_data(test2_questions, test2_answers, test2_explanations)
    test2_json = create_test_json(2, test2_data)
    
    with open(frontend_data_dir / 'test2.json', 'w', encoding='utf-8') as f:
        json.dump(test2_json, f, indent=2, ensure_ascii=False)
    print(f"✓ Test 2 saved: {len(test2_data)} questions")
    
    print("\n✅ Conversion complete!")
    print(f"   Test 1: {len(test1_json['domains'])} domains")
    print(f"   Test 2: {len(test2_json['domains'])} domains")


if __name__ == '__main__':
    main()
