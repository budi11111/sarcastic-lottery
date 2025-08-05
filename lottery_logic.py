import random
from typing import Dict, List, Any


class LotteryGenerator:
    def __init__(self):
        self.lottery_rules = {
            'powerball': {
                'name': 'Powerball (USA)',
                'main_numbers': {'count': 5, 'range': (1, 69)},
                'bonus_numbers': {'count': 1, 'range': (1, 26), 'name': 'Powerball'}
            },
            'megamillions': {
                'name': 'Mega Millions (USA)',
                'main_numbers': {'count': 5, 'range': (1, 70)},
                'bonus_numbers': {'count': 1, 'range': (1, 24), 'name': 'Mega Ball'}
            },
            'euromillions': {
                'name': 'EuroMillions',
                'main_numbers': {'count': 5, 'range': (1, 50)},
                'bonus_numbers': {'count': 2, 'range': (1, 12), 'name': 'Lucky Stars'}
            },
            'eurojackpot': {
                'name': 'Eurojackpot',
                'main_numbers': {'count': 5, 'range': (1, 50)},
                'bonus_numbers': {'count': 2, 'range': (1, 12), 'name': 'Euro Numbers'}
            }
        }

    def generate(self, lottery_type: str) -> Dict[str, Any]:
        """Generate numbers for specified lottery type"""
        if lottery_type not in self.lottery_rules:
            lottery_type = 'powerball'

        rules = self.lottery_rules[lottery_type]

        # Generate main numbers
        main_range = rules['main_numbers']['range']
        main_count = rules['main_numbers']['count']
        main_numbers = sorted(random.sample(range(main_range[0], main_range[1] + 1), main_count))

        # Generate bonus numbers
        bonus_range = rules['bonus_numbers']['range']
        bonus_count = rules['bonus_numbers']['count']
        bonus_numbers = sorted(random.sample(range(bonus_range[0], bonus_range[1] + 1), bonus_count))

        return {
            'lottery_name': rules['name'],
            'main_numbers': main_numbers,
            'bonus_numbers': bonus_numbers,
            'bonus_name': rules['bonus_numbers']['name'],
            'lottery_type': lottery_type
        }

    def get_all_lottery_info(self) -> Dict[str, Any]:
        """Return information about all available lotteries"""
        return self.lottery_rules
