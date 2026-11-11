# BronchoTrainer

A small web trainer for airway anatomy: fly through a 3D bronchial tree, see the matching CT slices, and practise naming
the airways. Open it at https://ezbreezy.github.io/bronchoscopytrainer/. It also works offline after the first load.

The BronchMap planner demo (plan a bronchoscopic route to a lesion on a public CT; research prototype, not for clinical
use) is under /planner/: https://ezbreezy.github.io/bronchoscopytrainer/planner/.

This repository contains only the built site. The source is private.

## Credits

- CT data: LIDC-IDRI (Armato SG III et al.), The Cancer Imaging Archive, CC BY 3.0.
  https://doi.org/10.7937/K9/TCIA.2015.LO9QL9SX
- Planner cases: National Lung Screening Trial CTs (TCIA, CC BY 4.0) with NLSTSeg lesion masks (Krishnaswamy D, Clunie DA,
  Fedorov A; CC BY 4.0), and LIDC-IDRI CT and nodule annotations (CC BY 3.0). Full attribution per case is shown in the planner.
- Segmentation: TotalSegmentator. Wasserthal J et al. "TotalSegmentator: Robust Segmentation of 104 Anatomic Structures
  in CT Images", Radiology: Artificial Intelligence, 2023. https://doi.org/10.1148/ryai.230024

## Disclaimer

Educational prototype. Not for clinical use. Built from one public research CT; anatomy varies between patients.
