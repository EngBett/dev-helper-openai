import re

def clean_text(text: str) -> str:
    # Remove <think> tags and their content
    text = remove_think_tags(text)

    # Format the response text
    text = format_response(text)

    # Format mathematical expressions to HTML
    text = format_math_to_html(text)

    return text

def remove_think_tags(text: str) -> str:
    return re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL)

def format_response(text: str) -> str:
    # Replace ### headers with a bullet, I used an emoji
    text = re.sub(r'^###\s*', '🔹 ', text, flags=re.MULTILINE)

    # Convert bold markdown (**text**) to <strong>
    text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)

    # Convert italic markdown (*text*) to <i>
    text = re.sub(r'(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)', r'<i>\1</i>', text)

    return text

def format_math_to_html(text):
    # Replace \pi with &pi;
    text = re.sub(r'\\pi', '&pi;', text)

    # Replace \frac{numerator}{denominator} with <sup>numerator</sup>&frasl;<sub>denominator</sub>
    text = re.sub(r'\\frac\{(.*?)\}\{(.*?)\}', r'<sup>\1</sup>&frasl;<sub>\2</sub>', text)

    # Replace superscripts like ^2 with <sup>2</sup>
    text = re.sub(r'\^(\d+)', r'<sup>\1</sup>', text)

    # Replace \dots with &hellip;
    text = re.sub(r'\\dots', '&hellip;', text)

    # Replace common mathematical symbols
    symbols = {
        r'\\times': '&times;',
        r'\\div': '&divide;',
        r'\\pm': '&plusmn;',
        r'\\neq': '&ne;',
        r'\\leq': '&le;',
        r'\\geq': '&ge;',
        r'\\infty': '&infin;',
        r'\\sqrt': '&radic;',
        r'\\alpha': '&alpha;',
        r'\\beta': '&beta;',
        r'\\gamma': '&gamma;',
        r'\\delta': '&delta;',
        r'\\theta': '&theta;',
        r'\\lambda': '&lambda;',
        r'\\mu': '&mu;',
        r'\\sigma': '&sigma;',
        r'\\omega': '&omega;',
    }
    for latex, html in symbols.items():
        text = re.sub(latex, html, text)

    # Replace \( and \) with nothing (remove LaTeX delimiters)
    text = re.sub(r'\\\(|\\\)', '', text)

    return text