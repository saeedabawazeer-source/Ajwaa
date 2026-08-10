import os
from PIL import Image

input_dir = 'public/mascot'
output_dir = 'public/mascot_ajwa'
os.makedirs(output_dir, exist_ok=True)

# Ajwa date colors (dark brown/blackish)
# Skin: #4c3024
# Shirt: #2c1a12
# Pants: #3b2319
# Hair/Shoes: #1a0f0a
# Headband (Red from brand): #d62828

color_map = {
    (255, 224, 177): (76, 48, 36),   # Skin -> Dark Brown
    (46, 204, 113): (44, 26, 18),    # Green shirt -> Very Dark Brown
    (196, 138, 81): (214, 40, 40),   # Brown hair/shoes -> Red (Headband/shoes)
    (52, 152, 219): (59, 35, 25),    # Blue pants -> Medium Dark Brown
    
    # Shading variants mapping
    (215, 189, 147): (60, 38, 28),   # Skin shadow
    (37, 168, 92): (34, 20, 14),     # Shirt shadow
    (184, 130, 77): (180, 30, 30),   # Hair/shoes shadow
    (47, 138, 199): (48, 28, 20),    # Pants shadow
    (127, 112, 88): (50, 30, 20),
    (42, 125, 180): (40, 24, 16)
}

def distance(c1, c2):
    return sum((a - b) ** 2 for a, b in zip(c1[:3], c2[:3])) ** 0.5

for filename in os.listdir(input_dir):
    if filename.endswith('.png') and 'player' in filename:
        img = Image.open(os.path.join(input_dir, filename)).convert('RGBA')
        data = img.getdata()
        new_data = []
        for item in data:
            if item[3] > 0: # Not transparent
                # Find closest color in map
                closest = min(color_map.keys(), key=lambda k: distance(item, k))
                if distance(item, closest) < 60:
                    new_color = color_map[closest]
                    new_data.append((new_color[0], new_color[1], new_color[2], item[3]))
                else:
                    new_data.append(item)
            else:
                new_data.append(item)
        
        img.putdata(new_data)
        img.save(os.path.join(output_dir, filename.replace('player_', 'ajwa_')))

print("Colorization complete!")
