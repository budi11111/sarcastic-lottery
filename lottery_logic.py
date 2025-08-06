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

    def generate_custom(self, main_count: int, main_max: int, extra_count: int = 0, extra_max: int = 0) -> Dict[
        str, Any]:
        """Generate numbers for custom lottery configuration"""

        # Validation
        if main_count <= 0 or main_max <= 0:
            raise ValueError("Main numbers count and max must be positive")

        if main_count > main_max:
            raise ValueError(f"Cannot pick {main_count} numbers from a pool of {main_max}")

        if extra_count > 0 and (extra_max <= 0 or extra_count > extra_max):
            raise ValueError(f"Cannot pick {extra_count} extra numbers from a pool of {extra_max}")

        # Performance limits
        if main_count > 100 or main_max > 10000:
            raise ValueError("Number limits exceeded for performance reasons")

        # Generate main numbers
        main_numbers = sorted(random.sample(range(1, main_max + 1), main_count))

        # Generate extra numbers if requested
        extra_numbers = []
        if extra_count > 0:
            extra_numbers = sorted(random.sample(range(1, extra_max + 1), extra_count))

        return {
            'lottery_name': f'Custom Lottery ({main_count}/{main_max}' + (
                f' + {extra_count}/{extra_max}' if extra_count > 0 else '') + ')',
            'main_numbers': main_numbers,
            'bonus_numbers': extra_numbers,
            'bonus_name': 'Extra Numbers' if extra_count > 0 else '',
            'lottery_type': 'custom'
        }

    def get_all_lottery_info(self) -> Dict[str, Any]:
        """Return information about all available lotteries"""
        return self.lottery_rules
