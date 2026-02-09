import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ClientDestinataireService } from '../../../../Core/services/client-destinataire.service';
import { ColisService } from '../../../../Core/services/colis.service';
import { ColisRequest } from '../../../../Core/api/models/colis-request';

@Component({
  selector: 'app-create-colis-wizard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="wizard-container">
      <div class="wizard-steps">
        <div class="step" [class.active]="currentStep === 1" [class.complete]="currentStep > 1">
          <span class="step-num">1</span>
          <span class="step-label">Recipient</span>
        </div>
        <div class="step-line"></div>
        <div class="step" [class.active]="currentStep === 2" [class.complete]="currentStep > 2">
          <span class="step-num">2</span>
          <span class="step-label">Package Info</span>
        </div>
      </div>

      <!-- Step 1: Destinataire -->
      <form [formGroup]="step1Form" *ngIf="currentStep === 1" (ngSubmit)="nextStep()">
        <div class="form-grid">
          <div class="form-group">
            <label>Last Name</label>
            <input formControlName="nom" placeholder="Recipient's last name">
          </div>
          <div class="form-group">
            <label>First Name</label>
            <input formControlName="prenom" placeholder="Recipient's first name">
          </div>
          <div class="form-group">
            <label>Email Address</label>
            <input formControlName="email" type="email" placeholder="recipient@example.com">
          </div>
          <div class="form-group">
            <label>Phone Number</label>
            <input formControlName="telephone" placeholder="+212 600-000000">
          </div>
          <div class="form-group full-width">
            <label>Address</label>
            <input formControlName="adresse" placeholder="Street, City, Building...">
          </div>
        </div>

        <div class="wizard-footer">
            <button type="button" class="btn-secondary" (click)="canceled.emit()">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="step1Form.invalid || isLoading">
                {{ isLoading ? 'Saving...' : 'Next >' }}
            </button>
        </div>
      </form>

      <!-- Step 2: Colis & Produits -->
      <form [formGroup]="step2Form" *ngIf="currentStep === 2" (ngSubmit)="submitColis()">
        <div class="form-grid">
          <div class="form-group">
            <label>Weight (kg)</label>
            <input formControlName="poids" type="number" placeholder="0.0">
          </div>
          <div class="form-group">
            <label>Priority</label>
            <select formControlName="priorite">
              <option value="BASIQUE">Low (Basique)</option>
              <option value="NORMAL">Standard (Normal)</option>
              <option value="URGENT">High (Urgent)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Destination City</label>
            <input formControlName="villeDestination" placeholder="e.g. Casablanca">
          </div>
          <div class="form-group">
              <label>Origin Zip Code</label>
              <input formControlName="codePostalOrigine" placeholder="20000" title="Zip code of pickup location">
          </div>
          <div class="form-group">
              <label>Dest. Zip Code</label>
              <input formControlName="codePostal" placeholder="20000" title="Must be a valid postal code (e.g. 20000)">
          </div>
          <div class="form-group full-width">
            <label>Notes</label>
            <textarea formControlName="description" rows="2" placeholder="Optional notes..."></textarea>
          </div>
        </div>

        <!-- Cargo Manifest: Produits -->
        <div class="manifest-section">
            <div class="section-header">
                <label>Items (Weight must be > 0.5kg)</label>
                <button type="button" class="add-item-btn" (click)="addProduct()">+ Add Item</button>
            </div>

            <div formArrayName="produits" class="produits-list">
                <div *ngFor="let p of produits.controls; let i=index" [formGroupName]="i" class="produit-row">
                    <input formControlName="nom" placeholder="Item Name">
                    <input formControlName="categorie" placeholder="Category">
                    <input formControlName="quantite" type="number" placeholder="Qty" class="qty-input">
                    <input formControlName="poids" type="number" placeholder="Kg (>0.5)" class="qty-input">
                    <button type="button" class="remove-btn" (click)="removeProduct(i)">×</button>
                </div>
            </div>
        </div>

        <div class="wizard-footer">
            <button type="button" class="btn-secondary" (click)="currentStep = 1">Back</button>
            <button type="submit" class="btn-primary" [disabled]="step2Form.invalid || isLoading || produits.length === 0">
                {{ isLoading ? 'Creating...' : 'Create Shipment' }}
            </button>
        </div>
      </form>

      <div class="error-banner" *ngIf="errorMessage">
        <span class="icon">⚠</span> {{ errorMessage }}
      </div>
    </div>
  `,
  styleUrls: ['./create-colis-wizard.component.css']
})
export class CreateColisWizardComponent implements OnInit {
  @Input() userEmail: string = '';
  @Output() completed = new EventEmitter<void>();
  @Output() canceled = new EventEmitter<void>();

  currentStep = 1;
  isLoading = false;
  errorMessage = '';

  step1Form: FormGroup;
  step2Form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private clientDestinataireService: ClientDestinataireService,
    private colisService: ColisService
  ) {
    this.step1Form = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      adresse: ['', Validators.required]
    });

    this.step2Form = this.fb.group({
      poids: ['', [Validators.required, Validators.min(0.1)]],
      priorite: ['NORMAL', Validators.required],
      villeDestination: ['', Validators.required],
      codePostal: ['', Validators.required],
      codePostalOrigine: ['', Validators.required],
      description: [''],
      produits: this.fb.array([])
    });
  }

  ngOnInit() {
    this.addProduct();
  }

  get produits() {
    return this.step2Form.get('produits') as FormArray;
  }

  addProduct() {
    const productForm = this.fb.group({
      nom: ['', Validators.required],
      categorie: ['', Validators.required],
      quantite: [1, [Validators.required, Validators.min(1)]],
      poids: [0.5, [Validators.required, Validators.min(0.5)]], 
      prix: [1.0, [Validators.required, Validators.min(0)]]
    });
    this.produits.push(productForm);
  }

  removeProduct(index: number) {
    if (this.produits.length > 1) {
      this.produits.removeAt(index);
    }
  }

  async nextStep() {
    if (this.step1Form.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    try {
      await this.clientDestinataireService.registerDestinataire(this.step1Form.value).toPromise();
      this.currentStep = 2;
    } catch (err: any) {
      this.errorMessage = err.error?.message || 'Error saving recipient details.';
    } finally {
      this.isLoading = false;
    }
  }

  async submitColis() {
    if (this.step2Form.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const formValue = this.step2Form.value;
      const request: ColisRequest = {
        poids: formValue.poids,
        priorite: formValue.priorite,
        villeDestination: formValue.villeDestination,
        codePostal: formValue.codePostal,
        codePostalOrigine: formValue.codePostalOrigine,
        description: formValue.description || 'Standard Delivery',
        clientExpediteurEmail: this.userEmail,
        destinataireEmail: this.step1Form.value.email,
        produits: formValue.produits.map((p: any) => ({
          nom: p.nom,
          categorie: p.categorie,
          poids: p.poids,
          prix: p.prix,
          colisProduit: {
            quantite: p.quantite
          }
        }))
      };

      await this.colisService.createColis(request).toPromise();
      this.completed.emit();
    } catch (err: any) {
      
      let msg = 'Failed to create shipment. Please try again.';
      if (err.error) {
        if (typeof err.error === 'string') {
          msg = err.error;
        } else if (err.error.message) {
          msg = err.error.message;
        } else if (err.error.errors) { 
          msg = JSON.stringify(err.error.errors || err.error);
        }
      }
      this.errorMessage = msg;
      console.error('Create Colis Error:', err);
    } finally {
      this.isLoading = false;
    }
  }
}
