import numpy as np
from stl import mesh

# Using an existing closed stl file:
your_mesh = mesh.Mesh.from_file('GayModel.stl')

volume, cog, inertia = your_mesh.get_mass_properties()
print ("Mesh", len(your_mesh[0]))
#print("Volume                                  = {0}".format(volume))
#print("Position of the center of gravity (COG) = {0}".format(cog))
#print("Inertia matrix at expressed at the COG  = {0}".format(inertia[0,:]))
#print("                                          {0}".format(inertia[1,:]))
#print("                                          {0}".format(inertia[2,:]))
